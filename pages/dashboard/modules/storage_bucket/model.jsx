import './style/index.less';

import React from 'react';
import {Main, ModalDelete, history} from 'ufec';
import config from './config.json';
import request from './request';
import __ from 'client/locale/dashboard.lang.json';

import createBucket from './pop/create_bucket/index';
import modifyCompetence from './pop/modify_competence/index';
import modifyQuota from './pop/modify_quota/index';

import utilConverter from '../../utils/unit_converter';
import moment from 'moment';
import Properties from 'client/components/basic_props/index';
import Monitor from './detail/monitor/index';
import {Progress} from 'antd';

import timeUtil from '../../utils/time_format';
import { Link } from 'react-router-dom';

class Model extends React.Component {
  constructor(props) {
    super(props);

    this.tableColRender(config.table.columns);

    this.state = {
      config: config,
      page: 1
    };

    ['onAction', 'onInitialize', 'btnListRender', 'refresh'].forEach(m => this[m] = this[m].bind(this));
  }

  onInitialize() {
    const path = history.getPathList();
    if(path.length > 1) {
      this.getSingle(path[1]);
    } else {
      this.getList();
    }
  }

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.key) {
        case 'capacity':
          let utilSize, utilSize_num, utilSize_unit, changeUnit;
          column.render = (col, item, i) => {
            let max_buckets = item.bucket_quota.max_size === -1 ? __.infinity : parseInt(item.bucket_quota['max_size_kb'] / 1024 / 1024);
            if(item.usage && item.usage['rgw.main']) {
              utilSize = utilConverter(item.usage['rgw.main'].size);
              utilSize_num = utilSize.num;
              utilSize_unit = utilSize.unit;
            } else {
              utilSize_num = 0;
              utilSize_unit = 'B';
            }

            switch(utilSize_unit) {
              case 'B':
                changeUnit = utilSize_num / 1024 / 1024 / 1024;
                break;
              case 'KB':
                changeUnit = utilSize_num / 1024 / 1024;
                break;
              case 'MB':
                changeUnit = utilSize_num / 1024;
                break;
              default:
                changeUnit = utilSize_num;
                break;
            }

            let max_buckets_unit = max_buckets !== __.infinity ? max_buckets + 'GB' : max_buckets;
            let percent = parseInt((changeUnit / max_buckets) * 100);
            let status = percent > 80 ? 'exception' : 'active';
            return (
              <div>
                <div className="progress-usage"><span style={{'fontSize': '12px'}}>{percent >= 0 ? percent + '%' : ''}</span><span style={{'float': 'right', 'fontSize': '12px'}}>{utilSize_num + utilSize_unit + '/' + max_buckets_unit}</span></div>
                <Progress percent={percent >= 0 ? percent : 0} showInfo={false} status={status}/>
              </div>
            );
          };
          break;
        case 'object_num':
          column.render = (col, item, i) => {
            let max_buckets = item.bucket_quota.max_objects !== -1 ? item.bucket_quota.max_objects : __.infinity;
            let usage_buckets = item.usage && item.usage['rgw.main'] ? item.usage['rgw.main'].num_objects : 0;
            let percent = parseInt((usage_buckets / max_buckets) * 100);
            let status = percent > 80 ? 'exception' : 'active';
            let max_buckets_unit = max_buckets !== __.infinity ? max_buckets + __.objects_entres : max_buckets;
            return (
              <div>
                <div className="progress-usage"><span style={{'fontSize': '12px'}}>{percent >= 0 ? percent + '%' : ''}</span><span style={{'float': 'right', 'fontSize': '12px'}}>{usage_buckets + '/' + max_buckets_unit}</span></div>
                <Progress percent={percent >= 0 ? percent : 0} showInfo={false} status={status}/>
              </div>
            );
          };
          break;
        case 'status':
          column.render = (col, item, i) => {
            return item.bucket_quota && item.bucket_quota.enabled ? <div className="quota enabled">{__.enabled_quota}</div> : <div className="quota disabled">{__.disabled_quota}</div>;
          };
          break;
        case 'upload_total':
          let upload;
          column.render = (col, item, i) => {
            if (item.bandwidth && item.bandwidth.bytesSent) {
              upload = utilConverter(item.bandwidth.bytesSent);
              return upload.num + upload.unit;
            }
            return 0;
          };
          break;
        case 'download_total':
          let download;
          column.render = (col, item, i) => {
            if (item.bandwidth && item.bandwidth.bytesReceived) {
              download = utilConverter(item.bandwidth.bytesReceived);
              return download.num + download.unit;
            }
            return 0;
          };
          break;
        case 'data_policy':
          column.render = (col, item, i) => {
            return (
              <Link to={`/data_policy/${item.placement_rule}`}>
                { item.placement_rule }
              </Link>
            );
          };
          break;
        case 'modify_time':
          column.render = (col, item, i) => {
            return moment(item.mtime).format('YYYY-MM-DD HH:mm:ss');
          };
          break;
        default:
          break;
      }
    });
  }

  getSingle(id) {
    this.clearState();
    let table = this.state.config.table;
    request.getListById(id).then(res => {
      table.data = [res];
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      this.updateTableData(table);
    });
  }

  getList(page) {
    this.clearState();
    let table = this.state.config.table;
    request.getList(page).then(res => {
      table.data = res.data;
      table.total = res.count;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      this.updateTableData(table);
    });
  }

  updateTableData(table) {
    let newConfig = this.state.config;
    newConfig.table = table;
    newConfig.table.loading = false;

    this.setState({
      config: newConfig
    });
  }

  clearState() {
    const dashboardRef = this.dashboard.current;
    if(dashboardRef) {
      dashboardRef.clearState();
    }
  }

  onAction(field, actionType, data, refs) {
    switch(field) {
      case 'btnList':
        this.onClickBtnList(data.key, data, refs);
        break;
      case 'detail':
        this.onClickDetailTabs(data.key, data, refs);
        break;
      case 'pagination':
        this.onClickPagination(data);
        break;
      case 'search':
        this.onClickSearch(data);
        break;
      default:
        break;
    }
  }

  onClickSearch(data) {
    const { value } = data;
    this.loadingTable();
    if(value) {
      this.getSingle(value);
    } else {
      this.getList();
    }
  }

  onClickBtnList(key, data, refs) {
    const { rows } = data,
      that = this;

    switch(key) {
      case 'create':
        createBucket(null, null, that.refresh);
        break;
      case 'modify_competence':
        modifyCompetence(rows[0], null, that.refresh);
        break;
      case 'modify_quota':
        modifyQuota(rows[0], null, that.refresh);
        break;
      case 'delete':
        ModalDelete({
          action: 'delete',
          __: __,
          data: rows,
          type: 'bucket',
          nameType: 'bucket',
          hasCheckbox: true,
          options: [{
            label: __.purge_objects,
            value: 'purge-objects'
          }],
          onDelete: function(_data, cb) {
            let purgeObjects = _data.value && _data.value.length > 0;

            request.deleteBuckets(rows, purgeObjects).then(res => {
              cb(true);
              that.refresh();
            }).catch(error => {
              cb(false, error);
            });
          }
        });
        break;
      case 'refresh':
        this.refresh();
        break;
      default:
        break;
    }
  }

  btnListRender(rows, btns) {
    for (let key in btns) {
      switch (key) {
        case 'modify_quota':
        case 'modify_competence':
          btns[key].disabled = (rows.length === 1) ? false : true;
          break;
        case 'delete':
          btns[key].disabled = (rows.length >= 1) ? false : true;
          break;
        default:
          break;
      }
    }
    return btns;
  }

  onClickPagination(data) {
    const { page } = data;
    this.loadingTable();
    this.getList(page);

    this.setState({
      page: page
    });
  }

  onClickDetailTabs(tabKey, data, refs) {
    let contents = refs.state.contents;
    const {rows} = data;
    const properties = this.getProperties(rows[0]);
    switch(tabKey) {
      case 'description':
        request.getAcl(rows[0].bucket, properties).then(res => {
          properties[6].title = __.competence;
          switch(res.Grants.length) {
            case 1:
              properties[6].content = __.private;
              break;
            case 2:
              let url = res.Grants[0].Grantee.URI.split('/');
              if (url[url.length - 1] === 'AuthenticatedUsers') {
                properties[6].content =__.authenticated_read;
              } else {
                properties[6].content =  __.public_read;
              }
              break;
            case 3:
              properties[6].content = __.public_read_write;
              break;
            default:
              break;
          }
          refs.loading(true, () => {
            contents[tabKey] = (
              <div>
                <Properties __={this.props.__} properties={properties} />
                <Monitor __={this.props.__} user={rows[0].owner} bucket={rows[0].bucket}/>
              </div>
            );
            refs.setState({
              loading: false,
              contents: contents
            });
          });
        });
        break;
      default:
        break;
    }
  }

  getProperties(data) {
    const objectQuota = data.bucket_quota.max_objects === -1 ? __.infinity : data.bucket_quota.max_objects + __.objects_entres;
    const bucketQUota = data.bucket_quota.max_size === -1 ? __.infinity : data.bucket_quota.max_size_kb / 1024 / 1024 + ' GB';
    const compressionRatio = data.usage && data.usage['rgw.main'] && data.usage['rgw.main'].size_kb_utilized  / (data.usage && data.usage['rgw.main'] && data.usage['rgw.main'].size_kb);

    const properties = [{
      title: 'name',
      content: data.bucket
    }, {
      title: 'owner',
      content: data.owner
    }, {
      title: 'data_policy',
      content: data.placement_rule
    }, {
      title: 'bucket_qutoa',
      content: bucketQUota
    }, {
      title: 'objects_qutoa',
      content: objectQuota
    }, {
      title: 'created_at',
      content: timeUtil(data.mtime)
    }, {
      title: 'competence'
    },{
      title: 'compression_algorithm',
      content: data.placement.compression !== '' ? data.placement.compression : '-'
    }, {
      title: 'compression_ratio',
      content: data.placement.compression !== '' ? compressionRatio !== undefined ? (compressionRatio * 100).toFixed(2) + '%' : '-' : '-'
    }];

    return properties;
  }

  refresh() {
    if(this.state.config.table.loading) {
      return;
    }
    this.loadingTable();
    this.getList(this.state.page);
  }

  loadingTable() {
    let _config = this.state.config;
    _config.table.loading = true;

    this.setState({
      config: _config
    });
  }

  dashboard = React.createRef();

  render() {
    const state = this.state;
    //const props = this.props;
    return (
      <div className="garen-module-storage-bucket">
        <Main
          ref={ this.dashboard }
          config={state.config}
          onAction={this.onAction}
          btnListRender={this.btnListRender}
          onInitialize={this.onInitialize}
          __={__}
        />
      </div>
    );
  }
}

export default Model;