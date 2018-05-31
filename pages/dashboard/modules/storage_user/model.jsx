import './style/index.less';

import React from 'react';
import {Main, ModalAlert, ModalDelete, history} from 'ufec';
import config from './config.json';
import request from './request';
import createUser from './pop/create_user/index';
import modifyUser from './pop/modify_user/index';
import modifyQuota from './pop/modify_quota/index';
import createKeyPair from './pop/create_keypair/index';
import deleteKeyPair from './pop/delete_keypair/index';
import {Table} from 'antd';
import unit from '../../utils/unit';
import __ from 'client/locale/dashboard.lang.json';
import {Progress} from 'antd';
import Properties from 'client/components/basic_props/index';
import Monitor from './detail/monitor/index';
import moment from 'moment';
import Status from 'client/components/status_with_circle/index';
import { Link } from 'react-router-dom';
import getErrorMessage from '../../utils/error_message';

class Model extends React.Component {
  constructor(props) {
    super(props);
    this.tableColRender(this.state.config.table.columns);
    ['onInitialize', 'onAction'].forEach(func => {
      this[func] = this[func].bind(this);
    });
  }

  state = {
    config: config,
    page: 1
  };

  onInitialize() {
    const path = history.getPathList();
    if(path.length > 1) {
      this.getSingle(path[1]);
    } else {
      this.getList();
    }
  }

  onAction(field, actionType, data, refs) {
    switch(field) {
      case 'btnList':
        this.onClickBtnList(data.key, actionType, data, refs);
        break;
      case 'detail':
        this.onClickDetailTabs(data.key, data, refs);
        break;
      case 'search':
        this.onClickSearch(data);
        break;
      case 'pagination':
        this.onClickPagination(data);
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

  onClickBtnList(key, actionType, data, refs) {
    const { rows } = data;
    let that = this;
    switch(key) {
      case 'create':
        createUser(null, ()=> {
          that.clearState();
          that.refresh();
        });
        break;
      case 'start':
        ModalAlert({
          __: this.props.__,
          title: ['start', 'storage', 'user'],
          message: this.props.__.yorn_user_tip.replace('{0}', rows[0].user_id),
          btnValue: 'confirm',
          btnType: 'primary',
          onAction: (cb) => {
            let data = {
              suspended: false,
              uid: rows[0].user_id,
              email: rows[0].email
            };

            request.updateUser(data).then(()=> {
              cb(true);
              this.refresh();
            }).catch(err => {
              cb(false, getErrorMessage(err));
            });
          }
        });
        break;
      case 'forbidden':
        ModalAlert({
          __: this.props.__,
          title: ['forbidden', 'storage', 'user'],
          message: this.props.__.yorn_forbidden_user_tip.replace('{0}', rows[0].user_id),
          btnValue: 'confirm',
          btnType: 'primary',
          onAction: (cb) => {
            let data = {
              suspended: true,
              uid: rows[0].user_id,
              email: rows[0].email
            };
            request.updateUser(data).then(()=> {
              cb(true);
              this.refresh();
            }).catch(err => {
              cb(false, getErrorMessage(err));
            });
          }
        });
        break;
      case 'modify_user_information':
        modifyUser(rows[0], ()=> {
          that.clearState();
          that.refresh();
        });
        break;
      case 'modify_quota':
        modifyQuota(rows[0], null, ()=> {
          that.clearState();
          that.refresh();
        });
        break;
      case 'create_keypair':
        createKeyPair(rows[0], ()=> {
          that.clearState();
          that.refresh();
        });
        break;
      case 'delete_keypair':
        deleteKeyPair(rows[0], ()=> {
          that.clearState();
          that.refresh();
        });
        break;
      case 'delete_user':
        ModalDelete({
          action: 'delete',
          __: __,
          data: rows,
          type: 'user',
          nameType: 'user',
          hasCheckbox: true,
          options: [{
            label: __.purge_data,
            value: 'purge-data'
          }],
          onDelete: function(_data, cb) {
            let purgeData = _data.value && _data.value.length > 0 ? true : false;

            request.deleteUser(rows, purgeData).then((res)=> {
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
        case 'create':
          btns[key].disabled = false;
          break;
        case 'modify_user_information':
          btns[key].disabled = (rows.length === 1 && rows[0].user_id !== 'admin') ? false : true;
          break;
        case 'modify_quota':
          btns[key].disabled = (rows.length === 1 && rows[0].user_id !== 'admin') ? false : true;
          break;
        case 'create_keypair':
          btns[key].disabled = (rows.length === 1 && rows[0].user_id !== 'admin') ? false : true;
          break;
        case 'delete_keypair':
          btns[key].disabled = (rows.length === 1 && rows[0].user_id !== 'admin') ? false : true;
          break;
        case 'forbidden':
          btns[key].disabled = (rows.length === 1 && rows[0].suspended === 0 && rows[0].user_id !== 'admin') ? false : true;
          break;
        case 'start':
          btns[key].disabled = (rows.length === 1 && rows[0].suspended === 1 && rows[0].user_id !== 'admin') ? false : true;
          break;
        case 'delete_user':
          btns[key].disabled = (rows.length >= 1 && rows[0].user_id !== 'admin') ? false : true;
          break;
        case 'refresh':
          btns[key].disabled = false;
          break;
        default:
          break;
      }
    }
    return btns;
  }

  onClickDetailTabs(tabKey, data, refs) {
    let contents = refs.state.contents;
    const {rows} = data;
    const properties = this.getProperties(rows[0]);
    switch(tabKey) {
      case 'monitor':
        refs.loading(true, () => {
          contents[tabKey] = (
            <div>
              <Properties __={this.props.__} properties={properties} />
              <Monitor __={this.props.__} user={rows[0].user_id} />
            </div>
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        break;
      case 'keypair':
        let keypairColumns = [{
          'title': __.visit + __.secret,
          'key': 'access_key',
          'dataIndex': 'access_key'
        }, {
          'title': __.safety + __.secret,
          'key': 'secret_key',
          'dataIndex': 'secret_key'
        }];

        let keyPairDatas= [];
        data.rows[0].keys.forEach((item) => {
          keyPairDatas.push({
            'id': item.user,
            'key': item.user + Math.random(),
            'access_key': item.access_key,
            'secret_key': item.secret_key
          });
        });

        contents[tabKey] =(
          <div>
            <p>{__.keypair + __.list}</p>
            <Table
              loading={false}
              locale={{emptyText: '暂无数据'}}
              pagination={false}
              columns={keypairColumns}
              dataSource={keyPairDatas}>
            </Table>
          </div>
        );
        refs.setState({
          loading: false,
          contents: contents
        });
        break;
      case 'bucket':
        let columns = [{
          'title': __.name,
          'key': 'bucket',
          'dataIndex': 'bucket',
          render: (text, rows) => {
            return (
              <Link to={`/storage_bucket/${rows.bucket}`}>
                { rows.bucket }
              </Link>
            );
          }
        }, {
          'title': __.time,
          'key': 'mtime',
          'dataIndex': 'mtime'
        }];

        let bucketDatas = [];

        refs.loading(true, () => {
          let data = {
            uid: rows[0].id
          };
          request.getBucketList(data).then(res => {
            res.data.forEach((item) => {
              bucketDatas.push({
                bucket: item.bucket,
                key: item.id,
                mtime: moment(item.mtime).format('YYYY-MM-DD HH:mm:ss')
              });
            });
            contents[tabKey] =(
              <div>
                <p>{__.bucket_list}</p>
                <Table
                  loading={false}
                  locale={{emptyText: '暂无数据'}}
                  pagination={false}
                  columns={columns}
                  dataSource={bucketDatas}>
                </Table>
              </div>
            );
            refs.setState({
              loading: false,
              contents: contents
            });
          });
        });
        break;
      case 'quota':
        //存储桶
        let usage_buckets = rows[0].buckets.length;
        let max_buckets = rows[0].max_buckets;
        let bucketPercent = parseInt((usage_buckets / max_buckets) * 100);
        let bucketStatus = bucketPercent > 80 ? 'exception' : 'active';

        //对象
        let max_objects = rows[0].user_quota.max_objects;
        let usage_objects = parseInt(rows[0].stats.stats.total_entries / 1024 / 1024);
        let objectPercent = parseInt((usage_objects / max_objects) * 100);
        let objectStatus = objectPercent > 80 ? 'exception' : 'active';
        let showObjects = max_objects === -1 ? __.infinity : max_objects;
        let unused = max_objects === -1 ? __.infinity : max_objects - usage_objects;

        //容量
        let max_capacity_kb = rows[0].user_quota.max_size_kb;
        let usage_capacity_kb = rows[0].stats.stats.total_bytes / 1024;
        let capacityPercent = max_capacity_kb === 0 ? 0 : parseInt((usage_capacity_kb / max_capacity_kb) * 100);
        let capacityStatus = capacityPercent > 80 ? 'exception' : 'active';
        let showCapacity = max_capacity_kb === 0 ? __.infinity : parseInt(max_capacity_kb / 1024 / 1024);
        let usage_capacity_gb = parseInt(usage_capacity_kb / 1024 / 1024 / 1024);
        let unusedCapacity = max_capacity_kb === 0 ? __.infinity : parseInt(max_capacity_kb / 1024 / 1024) - usage_capacity_gb;

        contents[tabKey] = (
          <div className="detail-quota">
            <div className="detail-user-quota">
              <div className="detail-name">
                {__.userQuota}
              </div>
              <div className="detail-form">
                <div className="detail-form-per">
                  <p className="detail-form-per-title">{__.bucketQuota + ' :'}</p>
                  <p className="detail-form-per-number">{max_buckets}<span>{__.per}</span></p>
                  <div className="progress-usage-proportion">{usage_buckets + ' / ' + max_buckets}</div>
                  <Progress percent={bucketPercent} showInfo={false} status={bucketStatus}/>
                  <div className="progress-usage"><span style={{'fontSize': '12px'}}>{0}</span><span style={{'float': 'right', 'fontSize': '12px'}}>{max_buckets}</span></div>
                  <div className="usage-base-base">
                    <i></i><p className="usage-base">{__.unused}<span>{max_buckets - usage_buckets}</span><span>{__.per}</span></p>
                  </div>
                  <div className="usage-base-base">
                    <i></i><p className="usage-base">{__.used}<span>{usage_buckets}</span><span>{__.per}</span></p>
                  </div>
                </div>
                <div className="detail-form-per">
                  <p className="detail-form-per-title">{__.capacity_qutoa + ' :'}</p>
                  <p className="detail-form-per-number">{showCapacity}<span>{'GB'}</span></p>
                  <div className="progress-usage-proportion">{usage_capacity_gb + ' / ' + showCapacity}</div>
                  <Progress percent={capacityPercent} showInfo={false} status={capacityStatus}/>
                  <div className="progress-usage"><span style={{'fontSize': '12px'}}>{0}</span><span style={{'float': 'right', 'fontSize': '12px'}}>{showCapacity}</span></div>
                  <div className="usage-base-base">
                    <i></i><p className="usage-base">{__.unused}<span>{unusedCapacity}</span><span>{'GB'}</span></p>
                  </div>
                  <div className="usage-base-base">
                    <i></i><p className="usage-base">{__.used}<span>{usage_capacity_gb}</span><span>{'GB'}</span></p>
                  </div>
                </div>
                <div className="detail-form-per">
                  <p className="detail-form-per-title">{__.objects_qutoa + ' :'}</p>
                  <p className="detail-form-per-number">{showObjects}<span>{__.per}</span></p>
                  <div className="progress-usage-proportion">{usage_objects + ' / ' + showObjects}</div>
                  <Progress percent={objectPercent} showInfo={false} status={objectStatus}/>
                  <div className="progress-usage"><span style={{'fontSize': '12px'}}>{0}</span><span style={{'float': 'right', 'fontSize': '12px'}}>{showObjects}</span></div>
                  <div className="usage-base-base">
                    <i></i><p className="usage-base">{__.unused}<span>{unused}</span><span>{__.per}</span></p>
                  </div>
                  <div className="usage-base-base">
                    <i></i><p className="usage-base">{__.used}<span>{usage_objects}</span><span>{__.per}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        refs.setState({
          loading: false,
          contents: contents
        });
        break;
      default:
        break;
    }
  }

  getProperties(data) {
    const status = data.suspended === 0 ? 'login' : 'logout';
    const text = data.suspended === 0 ? 'start' : 'forbidden';
    const objectQuota = data.user_quota.max_objects === -1 ? __.infinity : data.user_quota.max_objects + __.objects_entres;
    const properties = [{
      title: 'name',
      content: data.user_id
    }, {
      title: 'email',
      content: data.email
    }, {
      title: 'status',
      content: <Status status={status} text={__[text]} />
    }, {
      title: ['total', 'object', 'quota'],
      content: objectQuota
    }, {
      title: ['total', 'bucket', 'quota'],
      content: data.max_buckets + __.objects_entres
    }, {
      title: ['total', 'capacity', 'quota'],
      content: Math.ceil(unit.bytesToGB(data.user_quota.max_size)) + 'GB'
    }];
    return properties;
  }

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.key) {
        case 'suspended':
          column.render = (col, item, i) => {
            const status = item.suspended === 0 ? 'login' : 'logout';
            const text = item.suspended === 0 ? 'start' : 'forbidden';
            return <Status status={status} text={__[text]} />;
          };
          break;
        case 'system':
          column.render = (col, item, i) => {
            return item.system === 'true' ? __.true : __.false;
          };
          break;
        case 'max_buckets':
          column.render = (col, item, i) => {
            let max_buckets = item.max_buckets;
            let usage_buckets = item.buckets.length;
            let percent = parseInt((usage_buckets / max_buckets) * 100);
            let status = percent > 80 ? 'exception' : 'active';
            return (
              <div>
                <div className="progress-usage"><span style={{'fontSize': '12px'}}>{percent + '%'}</span><span style={{'float': 'right', 'fontSize': '12px'}}>{usage_buckets + '/' + max_buckets + __.objects_entres}</span></div>
                <Progress percent={percent} showInfo={false} status={status}/>
              </div>
            );
          };
          break;
        case 'user_quota':
          column.render = (col, item, i) => {
            return item.user_quota && item.user_quota.enabled ? <div className="quota enabled">{__.enabled_quota}</div> : <div className="quota disabled">{__.disabled_quota}</div>;
          };
          break;
        case 'bucket_quota':
          column.render = (col, item, i) => {
            return item.bucket_quota && item.bucket_quota.enabled ? <div className="quota enabled">{__.enabled_quota}</div> : <div className="quota disabled">{__.disabled_quota}</div>;
          };
          break;
        default:
          break;
      }
    });
  }

  onClickPagination(data) {
    const { page } = data;
    this.loadingTable();
    this.getList(page);

    this.setState({
      page: page
    });
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

  clearState() {
    const dashboardRef = this.dashboard.current;
    if(dashboardRef) {
      dashboardRef.clearState();
    }
  }

  dashboard = React.createRef();

  render() {
    const state = this.state;
    const props = this.props;
    return (
      <div className="garen-module-storage-user">
        <Main
          ref={ this.dashboard }
          config={state.config}
          btnListRender={this.btnListRender}
          onAction={this.onAction}
          onInitialize={this.onInitialize}
          __={props.__}
        />
      </div>
    );
  }

}

export default Model;
