import './style/index.less';

import React from 'react';
import {Main} from 'ufec';
import config from './config.json';
import request from './request';
import { Link } from 'react-router-dom';
import utilConverter from '../../utils/unit_converter';

class Model extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      config: config
    };

    this.timer = null;

    this.tableColRender(this.state.config.table.columns);

    ['onInitialize','onAction'].forEach(func => {
      this[func] = this[func].bind(this);
    });
  }

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'name':
          column.render = (text, row) => {
            return (
              <Link to={`/pool/${row.pool_name}`}>
                { row.pool_name }
              </Link>
            );
          };
          break;
        case 'read_bytes_sec':
          column.render = (text, row) => {
            if(row.client_io_rate.read_bytes_sec < 1024) {
              return row.client_io_rate.read_bytes_sec.toFixed(2) + ' B/s';
            } else {
              const textObj = utilConverter(row.client_io_rate.read_bytes_sec);
              return textObj.num + ' ' + textObj.unit + '/s';
            }
          };
          break;
        case 'read_op_per_sec':
          column.render = (text, row) => {
            return row.client_io_rate.read_op_per_sec;
          };
          break;
        case 'write_bytes_sec':
          column.render = (text, row) => {
            if(row.client_io_rate.write_bytes_sec < 1024) {
              return row.client_io_rate.write_bytes_sec.toFixed(2) + ' B/s';
            } else {
              const textObj = utilConverter(row.client_io_rate.write_bytes_sec);
              return textObj.num + ' ' + textObj.unit + '/s';
            }
          };
          break;
        case 'write_op_per_sec':
          column.render = (text, row) => {
            return row.client_io_rate.write_op_per_sec;
          };
          break;
        case 'recovering_bytes_per_sec':
          column.render = (text, row) => {
            if(row.recovery_rate.recovering_bytes_per_sec < 1024) {
              return row.recovery_rate.recovering_bytes_per_sec.toFixed(2) + ' B/s';
            } else {
              const textObj = utilConverter(row.recovery_rate.recovering_bytes_per_sec);
              return textObj.num + ' ' + textObj.unit + '/s';
            }
          };
          break;
        case 'recovering_keys_per_sec':
          column.render = (text, row) => {
            return row.recovery_rate.recovering_keys_per_sec;
          };
          break;
        case 'recovering_objects_per_sec':
          column.render = (text, row) => {
            return row.recovery_rate.recovering_objects_per_sec;
          };
          break;
        default:
          break;
      }
    });
  }

  onInitialize() {
    this.getList();
  }

  clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  getList() {
    let table = this.state.config.table;
    request.getList().then(res => {
      table.data = res.data;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      this.updateTableData(table);
    }).finally(() => {
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.getList();
      }, 3000);
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
      case 'pagination':
        this.onClickPagination();
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

  onClickPagination() {
    this.loadingTable();
    this.getList();
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
      <div className="garen-module-pool-monitoring">
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
