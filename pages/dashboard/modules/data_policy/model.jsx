import './style/index.less';

import React from 'react';
import {Main, ModalDelete, history} from 'ufec';
import config from './config.json';
import request from './request';
import __ from 'client/locale/dashboard.lang.json';
import {Table} from 'antd';
import createPolicy from './pop/create/index';
import modifyPolicy from './pop/modify/index';
import setDefaultPolicy from './pop/default_datapolicy/index';

import { Link } from 'react-router-dom';

class Model extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: config,
      page: 1
    };

    this.tableColRender(this.state.config.table.columns);

    ['onInitialize', 'onAction'].forEach(m => {
      this[m] =this[m].bind(this);
    });
  }

  onInitialize() {
    const path = history.getPathList();
    if(path.length > 1) {
      this.getSingle(path[1]);
    } else {
      this.getList();
    }
  }

  getList(page) {
    this.clearState();
    const table = this.state.config.table;
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

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.key) {
        case 'name':
          column.formatter = (text, row) => {
            return <div>
              {row.id}
              {row.default && row.default === true ? <div className="default">{__.default}</div> : null}
            </div>;
          };
          break;
        case 'associated_pool':
          column.render = (col, item, i) => {
            return <Link to={`/pool/${item.data_pool}`}>
              { item.data_pool }
            </Link>;
          };
          break;
        case 'yorn_zip':
          column.render = (col, item, i) => {
            return item.compression && item.compression !== '' ? <div className="switch enabled">{__.enabled_quota}</div> : <div className="switch disabled">{__.disabled_quota}</div>;
          };
          break;
        case 'yorn_index':
          column.render = (col, item, i) => {
            return item.index_type === 0 ? <div className="switch enabled">{__.enabled_quota}</div> : <div className="switch disabled">{__.disabled_quota}</div>;
          };
          break;
        default:
          break;
      }
    });
  }

  onAction(field, actionType, data, refs) {
    switch(field) {
      case 'btnList':
        this.onClickBtnList(data.key, actionType, data, refs);
        break;
      case 'search':
        this.onClickSearch(data);
        break;
      case 'detail':
        this.onClickDetailTabs(data.key, data, refs);
        break;
      case 'pagination':
        this.onClickPagination(data);
        break;
      default:
        break;
    }
  }

  onClickDetailTabs(tabKey, data, refs) {
    let contents = refs.state.contents;
    const {rows} = data;
    switch(tabKey) {
      case 'description':
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
          'title': __.owner,
          'key': 'owner',
          'dataIndex': 'owner'
        }, {
          'title': __.time,
          'key': 'mtime',
          'dataIndex': 'mtime'
        }];

        let bucketDatas = rows[0].buckets;
        bucketDatas.forEach(k => {
          k.key = k.id;
        });

        refs.loading(true, () => {
          contents[tabKey] =(
            <div>
              <p>{__.relevance_bucket_list}</p>
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

  getSingle(id) {
    this.clearState();
    let table = this.state.config.table;
    request.getSingleList(id).then(res => {
      table.data = [res];
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      this.updateTableData(table);
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

  onClickBtnList(key, actionType, data, refs) {
    const { rows } = data;
    let that = this;
    switch(key) {
      case 'create':
        createPolicy(null, null, ()=> {
          that.refresh();
        });
        break;
      case 'modify':
        modifyPolicy(rows[0], null, ()=> {
          that.refresh();
        });
        break;
      case 'setDefaultPolicy':
        setDefaultPolicy(rows[0], null, ()=> {
          that.refresh();
        });
        break;
      case 'delete':
        let hasBucket = rows.some(item => {
          return item.buckets && item.buckets.length > 0;
        });
        ModalDelete({
          action: 'delete',
          __: __,
          data: rows,
          hasAlert: hasBucket,
          alertTip: __.placement_alerttip,
          type: 'data_policy',
          nameType: 'data_policy',
          disabled: hasBucket,
          onDelete: function(_data, cb) {
            if(!hasBucket) {
              request.deletePolicy(rows).then(res => {
                cb(true);
                that.refresh();
              }).catch(error => {
                cb(false, error);
              });
            }
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
      switch(key) {
        case 'create':
        case 'setDefaultPolicy':
          btns[key].disabled = false;
          break;
        case 'modify':
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

  clearState() {
    const dashboardRef = this.dashboard.current;
    if(dashboardRef) {
      dashboardRef.clearState();
    }
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
    return (
      <div className="garen-module-data-policy">
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