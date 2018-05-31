import './style/index.less';

import React from 'react';
import {Main} from 'ufec';
import config from './config.json';
import request from './request';
import utilConverter from '../../utils/unit_converter';
import __ from 'client/locale/dashboard.lang.json';
import clone from 'client/utils/deep_clone';

class Model extends React.Component {

  constructor(props) {
    super(props);

    config.table.pagination.onShowSizeChange = this.onShowSizeChange.bind(this);

    this.state = {
      config: clone(config),
      // 为了避免重复翻译下拉框内容导致的空白，这里对副本进行操作
      page: 1,
      serverList: [],
      selectedPool: 'all',
      currentPoolOsdNames: [],
      pageSize: config.table.limit
    };

    this.timer = null;

    this.tableColRender(this.state.config.table.columns);
    this.addSorterForCol(this.state.config.table.columns);
    this.operationsGetValue(this.state.config.operations);

    ['onInitialize','onAction'].forEach(func => {
      this[func] = this[func].bind(this);
    });
  }

  addSorterForCol(columns) {
    columns.forEach(column => {
      switch (column.dataIndex) {
        case 'read_iops':
          column.sorter = (a, b) => {
            return a.iops_r - b.iops_r;
          };
          break;
        case 'write_iops':
          column.sorter = (a, b) => {
            return a.iops_w - b.iops_w;
          };
          break;
        case 'read_bandwidth':
          column.sorter = (a, b) => {
            return a.bw_r_bytes - b.bw_r_bytes;
          };
          break;
        case 'write_bandwidth':
          column.sorter = (a, b) => {
            return a.bw_w_bytes - b.bw_w_bytes;
          };
          break;
        case 'read_io_wait_time':
          column.sorter = (a, b) => {
            return a.latency_r_ms - b.latency_r_ms;
          };
          break;
        case 'write_io_wait_time':
          column.sorter = (a, b) => {
            return a.latency_w_ms - b.latency_w_ms;
          };
          break;
        default:
          break;
      }
    });
  }

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'read_iops':
          column.render = (text, row) => {
            return row.iops_r.toFixed(2);
          };
          break;
        case 'write_iops':
          column.render = (text, row) => {
            return row.iops_w.toFixed(2);
          };
          break;
        case 'read_bandwidth':
          column.render = (text, row) => {
            if(row.bw_r_bytes < 1024) {
              return row.bw_r_bytes.toFixed(2) + ' B';
            } else {
              const textObj = utilConverter(row.bw_r_bytes);
              return textObj.num + ' ' + textObj.unit;
            }
          };
          break;
        case 'write_bandwidth':
          column.render = (text, row) => {
            if(row.bw_w_bytes < 1024) {
              return row.bw_w_bytes.toFixed(2) + ' B';
            } else {
              const textObj = utilConverter(row.bw_w_bytes);
              return textObj.num + ' ' + textObj.unit;
            }
          };
          break;
        case 'read_io_wait_time':
          column.render = (text, row) => {
            return row.latency_r_ms.toFixed(2) + 'ms';
          };
          break;
        case 'write_io_wait_time':
          column.render = (text, row) => {
            return row.latency_w_ms.toFixed(2) + 'ms';
          };
          break;
        default:
          break;
      }
    });
  }

  operationsGetValue(opt) {
    opt[0].data = opt[0].data.map(item => {
      return {
        value: item.value,
        name: __[item.name]
      };
    });
  }

  onInitialize() {
    this.getPoolList();
  }

  getPoolList() {
    request.getPoolList().then(res => {
      this.setState({
        serverList: res.data
      }, () => {
        this.updateSelect(this.state);
        this.getList(true);
      });
    });
  }

  updateSelect(state) {
    const newConfig = state.config;
    newConfig.operations[0].data = [newConfig.operations[0].data[0]];
    state.serverList.forEach(item => {
      newConfig.operations[0].data.push({
        value: item.id,
        name: item.pool_name
      });
    });

    this.setState({
      config: newConfig
    });
  }

  clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  getList(getOsdSidHeader) {
    let table = this.state.config.table;
    request.getList(this.state.page, getOsdSidHeader).then(res => {
      if(this.state.selectedPool !== 'all') {
        const filteredList = this.filterListByPool(res.data);
        table.data = filteredList;
        table.total = filteredList.length;
        this.updateTableData(table);
      } else {
        table.data = res.data;
        table.total = res.count;
        this.updateTableData(table);
      }
    }).catch(err => {
      table.data = [];
      table.total = 0;
      this.updateTableData(table);
    }).finally(() => {
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.getList();
      }, 3000);
    });
  }

  onShowSizeChange(current, pageSize) {
    const newConfig = this.state.config;
    newConfig.table.limit = pageSize;
    this.setState({
      pageSize: pageSize,
      config: newConfig
    }, () => {
      this.loadingTable();
      this.getList();
    });
  }

  filterListByPool(data) {
    const { currentPoolOsdNames } = this.state;
    const filteredList = data.filter(osd => {
      return currentPoolOsdNames.indexOf(osd.name) !== -1;
    });
    return filteredList;
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
        this.onChangeOperation(actionType, data);
        break;
      case 'pagination':
        this.onClickPagination(data);
        break;
      default:
        break;
    }
  }

  onChangeOperation(type, data) {
    switch (type) {
      case 'select':
        this.onChangeSelect(data);
        break;
      default:
        break;
    }
  }

  onChangeSelect(data) {
    switch (data.key) {
      case 'pool':
        if(data.value !== 'all') {
          request.getSinglePool(data.value).then(res => {
            request.getOsdList(res.metadata_class).then(_res => {
              const poolOsdNames = _res.data.map(osd => {
                return osd.name;
              });

              this.setState({
                selectedPool: data.value,
                currentPoolOsdNames: poolOsdNames
              }, () => {
                this.loadingTable();
                this.getList();
              });
            });
          });
        } else {
          this.setState({
            selectedPool: data.value,
            currentPoolOsdNames: []
          }, () => {
            this.loadingTable();
            this.getList();
          });
        }
        break;
      default:
        break;
    }
  }

  onClickBtnList(key, actionType, data) {
    switch(key) {
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
    for(let key in btns) {
      switch(key) {
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
      <div className="garen-module-osd-monitoring">
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
