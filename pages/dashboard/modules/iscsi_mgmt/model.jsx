import './style/index.less';

import React from 'react';
import {Main, history} from 'ufec';
import config from './config.json';
import request from './request';
import Status from 'client/components/status_with_circle/index';
import { Link } from 'react-router-dom';
import timeUtil from '../../utils/time_format';
import utilConverter from '../../utils/unit_converter';
import { Button } from 'antd';


// pop
import popCreateClient from './pop/create/index';
import popUpdateClient from './pop/update/index';
import popAssociateVolumes from './pop/associate_volumes/index';
import popDeleteClient from './pop/delete/index';
// 这个是在详情的表格中一个一个断开
import popDisassociateVolume from './pop/disassociate_volume/index';

// detail
import Properties from 'client/components/basic_props/index';
import DetailTable from 'client/components/detail_table/index';

class Model extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      config: config,
      page: 1
    };

    this.tableColRender(this.state.config.table.columns);

    ['onInitialize','onAction'].forEach(func => {
      this[func] = this[func].bind(this);
    });
  }

  tableColRender(columns) {
    const __ = this.props.__;
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'name':
          column.formatter = (text, row) => {
            return row.wwn;
          };
          break;
        case 'login_status':
          column.render = (text, row) => {
            const status = row.status === 'LOGIN' ? 'login' : 'logout';
            return <Status status={status} text={__[status === 'login'?'login':'logout_d']} />;
          };
          break;
        // case 'gateway_server':
        //   column.render = (text, row) => {
        //     return '字段暂无';
        //   };
        //   break;
        case 'client_group':
          column.render = (text, row) => {
            return row.group_name;
          };
          break;
        case 'createdAt':
          column.render = (text, row) => {
            return timeUtil(row.created);
          };
          break;
        default:
          break;
      }
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

  getList() {
    this.clearState();
    let table = this.state.config.table;
    request.getList(this.state.page).then(res => {
      table.data = res.data;
      table.total = res.count;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      table.total = 0;
      this.updateTableData(table);
    });
  }

  getSingle(clientId) {
    let table = this.state.config.table;
    request.getSingleById(clientId).then(res => {
      table.data = [res];
      table.total = 1;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      table.total = 0;
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

  onAction(field, actionType, data, refs) {
    switch(field) {
      case 'btnList':
        this.onClickBtnList(data.key, actionType, data);
        break;
      case 'detail':
        this.onClickDetailTabs(data.key, data, refs);
        break;
      case 'search':
        this.onSearchTable(data);
        break;
      case 'pagination':
        this.onClickPagination(data);
        break;
      default:
        break;
    }
  }

  onClickBtnList(key, actionType, data) {
    const isSingle = data.rows.length === 1 ? true : false;
    const singleData = isSingle ? data.rows[0] : {};

    switch(key) {
      case 'create':
        popCreateClient(null, () => {
          this.refresh();
        });
        break;
      case 'modify':
        if(isSingle) {
          popUpdateClient(singleData, () => {
            this.refresh();
          });
        }
        break;
      case 'associate':
        if(isSingle) {
          popAssociateVolumes(singleData, () => {
            this.refresh();
          });
        }
        break;
      case 'delete':
        if(isSingle) {
          popDeleteClient(singleData, () => {
            this.refresh();
          });
        }
        break;
      case 'refresh':
        this.refresh();
        break;
      default:
        console.log('other');
        break;
    }
  }

  onClickPagination(data) {
    const { page } = data;
    this.loadingTable();
    this.setState({
      page: page
    }, () => {
      this.getList();
    });
  }

  onSearchTable(data) {
    const { value } = data;
    this.loadingTable();
    if(value) {
      this.getSingle(value);
    } else {
      this.getList();
    }
  }

  onClickDetailTabs(tabKey, data, refs) {
    let contents = refs.state.contents;
    const client = data.rows[0] && data.rows[0];

    if(client === undefined) {
      contents[tabKey] = (
        <div className="detail-no-data">{this.props.__.no_data}</div>
      );
      refs.setState({
        loading: false,
        contents: contents
      });
      return;
    }

    switch(tabKey) {
      case 'properties':
        refs.loading(true, () => {
          const properties = this.getProperties(client);
          const tableCfg = this.getDetailTableCfg(client);
          contents[tabKey] = (
            <div>
              <Properties __={this.props.__} properties={properties} />
              <DetailTable table={tableCfg} __={this.props.__} />
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

  getProperties(data) {
    const status = data.status === 'LOGIN' ? 'login' : 'logout';
    const __ = this.props.__;

    const properties = [{
      title: 'name',
      content: data.wwn
    }, {
      title: 'login_status',
      formatter: <Status status={status} text={__[status === 'login'?'login':'logout_d']} />
    }, {
      title: 'client_group',
      content: data.group_name
    }, {
      title: 'create_time',
      content: timeUtil(data.created)
    }];
    return properties;
  }

  getDetailTableCfg(data) {
    const tableData = data.disks;
    const __ = this.props.__;
    const table = {
      title: __.associated_block_storage_volumes,
      rowKey: 'id',
      columns: [{
        title: __.name,
        dataIndex: 'image',
        render: (text, row) => {
          return (
            <Link to={`/block_mgmt/${row.id}`}>
              { row.name }
            </Link>
          );
        }
      }, {
        title: __.allocated_capacity,
        dataIndex: 'size',
        render: (text, row) => {
          return utilConverter(row.size).num + utilConverter(row.size).unit;
        }
      }, {
        title: __.volume_type,
        dataIndex: 'format'
      }, {
        title: __.create_time,
        dataIndex: 'create_timestamp',
        render: (text, row) => {
          return timeUtil(row.create_timestamp);
        }
      }, {
        title: __.operation,
        key: 'operation',
        render: (text, row) => {
          const popData = {
            iqnName: data.wwn,
            disks: data.disks,
            diskId: row.id
          };
          return (
            <Button type="primary" disabled={data.status === 'LOGIN'} onClick={() => {
              popDisassociateVolume(popData, () => {
                this.refresh();
              });
            }}>
              {__.disassociate}
            </Button>
          );
        }
      }],
      data: tableData
    };

    return table;
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

  refresh() {
    if(this.state.config.table.loading) {
      return;
    }
    this.loadingTable();
    this.getList();
  }

  btnListRender(rows, btns) {
    const isSingle = rows.length === 1 ? true : false;

    for(let key in btns) {
      switch(key) {
        case 'modify':
        case 'associate':
        case 'delete':
          btns[key].disabled = !isSingle;
          break;
        default:
          break;
      }
    }
    return btns;
  }

  dashboard = React.createRef();

  render() {
    const state = this.state;
    const props = this.props;
    return (
      <div className="garen-module-client">
        <Main
          ref={ this.dashboard }
          config={state.config}
          onAction={this.onAction}
          onInitialize={this.onInitialize}
          btnListRender={this.btnListRender}
          __={props.__}
        />
      </div>
    );
  }

}

export default Model;
