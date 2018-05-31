import './style/index.less';

import React from 'react';
import {Main, history} from 'ufec';
import config from './config.json';
import request from './request';
import unit from '../../utils/unit';
import { Link } from 'react-router-dom';
import Status from './status';
import { Button } from 'antd';

// pop
import create from './pop/create/index';
import popOpenProtect from './pop/open_protect/index';
import popCloseProtect from './pop/close_protect/index';
import popUnlink from './pop/unlink/index';
import popEdit from './pop/edit/index';
import popDelete from './pop/delete/index';
// 这个是在 detail 部分弹出的断链弹窗
import popSingleUnlink from './pop/single_unlink/index';

// detail
import Properties from 'client/components/basic_props/index';
import DetailTable from 'client/components/detail_table/index';

class Model extends React.Component {

  constructor(props) {
    super(props);

    const iscsiInititalized = (GAREN.rbd && GAREN.rbd === 'initialized') ?
      true : false;

    // iscsi 未初始化，从下拉框中删掉 iscsi 选项
    // 注意目前默认情况下在 iscsi 未初始化下选中 block
    if(!iscsiInititalized && config.operations[0].data[0].value === 'iscsi') {
      config.operations[0].data.shift();
    }

    this.state = {
      config: config,
      page: 1,
      pools: [],
      currentPoolType: iscsiInititalized ? 'iscsi' : 'cloud',
      currentPool: ''
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
        case 'size':
          column.render = (text, row) => {
            return Math.ceil(unit.bytesToGB(row.size)) + 'GB';
          };
          break;
        case 'stroed_volume':
          column.render = (text, row) => {
            const poolName = row.id.split('.')[0];
            return (
              <Link to={`/block_mgmt/${poolName + '.' + row.image}`}>
                {row.image}
              </Link>
            );
          };
          break;
        case 'clone_volume_numbers':
          column.render = (text, row) => {
            return row.child.length;
          };
          break;
        case 'snapshot_status':
          column.render = (text, row) => {
            // 理论上应该是布尔值的，但是接口就是字符串。。。。
            const status = row.protected === 'true' ? 'protected' : 'unprotected';
            return (
              <Status status={status}
                text={__[status]} />
            );
          };
          break;
        default:
          break;
      }
    });
  }

  onInitialize() {
    const path = history.getPathList();
    request.getPoolList(this.state.currentPoolType).then(res => {
      this.updatePool(res.data);
      this.setState({
        pools: res.data,
        currentPool: res.data.length > 0 ? res.data[0].pool_name : ''
      }, () => {
        if(path.length > 1) {
          this.getSingle(path[1]);
        } else {
          this.getList();
        }
      });
    });
  }

  updatePool(pools) {
    let _config = this.state.config;
    let operations = [];
    pools.forEach(pool => {
      operations.push({
        name: pool.pool_name,
        value: pool.pool_name
      });
    });
    _config.operations[1].data = operations;
    _config.operations[1].value = operations[0] ? operations[0].value : null;

    if(this.state.currentPoolType === 'cloud') {
      _config.btns.forEach(btn => {
        if(btn.key !== 'refresh') {
          btn.disabled = true;
        }
      });
    } else {
      _config.btns.forEach(btn => {
        if(btn.key !== 'refresh') {
          btn.disabled = false;
        }
      });
    }

    this.setState({
      config: _config
    }, () => {
      delete _config.operations[1].value;
    });
  }

  getList() {
    this.clearState();
    let table = this.state.config.table;
    request.getList(this.state.currentPool, this.state.page).then(res => {
      table.data = res.data;
      table.total = res.count;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      table.total = 0;
      this.updateTableData(table);
    });
  }

  getSingle(id) {
    let table = this.state.config.table;
    request.getSingleById(id).then(res => {
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
      case 'operation':
        this.onClickOperationList(actionType, data.key, data);
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
    const { rows } = data;
    const isSingle = rows.length === 1 ? true : false;

    if(key === 'refresh') {
      this.refresh();
    } else {
      if(isSingle) {
        switch(key) {
          case 'create':
            create({snapData: rows[0], poolType: this.state.currentPoolType}, null, () => {
              this.refresh();
            });
            break;
          case 'open_snapshot_protect':
            if(rows[0].protected === 'false') {
              popOpenProtect(rows[0], null, () => {
                this.refresh();
              });
            }
            break;
          case 'close_snapshot_protect':
            if(rows[0].protected === 'true') {
              popCloseProtect(rows[0], null, () => {
                this.refresh();
              });
            }
            break;
          case 'unlink':
            popUnlink(rows[0], null, () => {
              this.refresh();
            });
            break;
          case 'edit':
            popEdit(rows[0], null, () => {
              this.refresh();
            });
            break;
          case 'delete':
            popDelete(rows[0], null, () => {
              this.refresh();
            });
            break;
          default:
            break;
        }
      }
    }
  }

  onSearchTable(data) {
    const { value } = data;
    this.loadingTable();
    if(value) {
      const pool = this.state.currentPool;
      const id = pool + '.' + value;
      this.getSingle(id);
    } else {
      this.getList();
    }
  }

  onClickOperationList(operationType, key, data) {
    switch(operationType) {
      case 'select':
        this.onClickSelect(key, data);
        break;
      default:
        break;
    }
  }

  onClickSelect(key, data) {
    switch(key) {
      case 'type':
        this.loadingTable();
        this.setState({
          currentPoolType: data.value
        }, () => {
          this.onInitialize();
        });
        break;
      case 'pool':
        this.loadingTable();
        this.setState({
          currentPool: data.value
        }, () => {
          this.getList();
        });
        break;
      default:
        break;
    }
  }

  onClickDetailTabs(tabKey, data, refs) {
    let contents = refs.state.contents;
    const snapshotId = data.rows[0] && data.rows[0].id;

    switch(tabKey) {
      case 'properties':
        if(snapshotId === undefined) {
          contents[tabKey] = (
            <div className="detail-no-data">{this.props.__.no_data}</div>
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        } else {
          refs.loading(true, () => {
            const properties = this.getProperties(data.rows[0]);
            const tableCfg = this.getDetailTableCfg(data.rows[0]);
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
        }
        break;
      default:
        break;
    }
  }

  getProperties(data) {
    const properties = [{
      title: 'name',
      content: data.snapshot
    }, {
      title: 'capacity',
      content: Math.ceil(unit.bytesToGB(data.size)) + 'GB'
    }, {
      title: 'stored_volume',
      content: data.image,
      link: `/block_mgmt/${data.image}`
    }, {
      title: 'stored_pool',
      content: data.pool
    }];
    return properties;
  }

  getDetailTableCfg(data) {
    const tableData = data.child;
    const __ = this.props.__;
    const table = {
      title: __.clone_volume,
      rowKey: 'image',
      columns: [{
        title: __.name,
        dataIndex: 'image',
        render: (text, row) => {
          return (
            <Link to={`/block_mgmt/${row.pool + '.' + row.image}`}>
              {row.image}
            </Link>
          );
        }
      }, {
        title: __.stored_pool,
        dataIndex: 'pool'
      }, {
        title: __.operation,
        key: 'operation',
        render: (text, row) => {
          const popData = {
            imageId: row.pool + '.' + row.image
          };
          return (
            <Button type="primary" onClick={() => {
              popSingleUnlink(popData, null, () => {
                this.refresh();
              });
            }}>
              {__.unlink}
            </Button>
          );
        }
      }],
      data: tableData
    };

    return table;
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
    this.loadingTable();
    this.getList();
  }

  btnListRender(rows, btns) {
    const isSingle = rows.length === 1 ? true : false;
    for(let key in btns) {
      switch(key) {
        case 'create':
        case 'unlink':
        case 'edit':
        case 'delete':
          btns[key].disabled = isSingle ? false : true;
          break;
        case 'open_snapshot_protect':
          btns[key].disabled = (isSingle && rows[0].protected === 'false') ? false : true;
          break;
        case 'close_snapshot_protect':
          btns[key].disabled = (isSingle && rows[0].protected === 'true') ? false : true;
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
      <div className="garen-module-snapshot-mgmt">
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

