import './style/index.less';

import React from 'react';
import {Main} from 'ufec';
import config from './config.json';
import request from './request';
import timeUtil from '../../utils/time_format';
import clone from 'client/utils/deep_clone';
import ExpandRow from './components/expand_row';
import Status from './components/status';

import popCreate from './pop/create/index';
import popMaintainCluster from './pop/maintain_cluster/index';
import popMaintainServer from './pop/maintain_server/index';
import popDelete from './pop/delete/index';

class Model extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      config: clone(config),
      selectedStatus: 'all',
      page: 1
    };

    this.tableColRender(this.state.config.table.columns);
    this.setExpandedRowRender(this.state.config.table);

    ['onInitialize','onAction'].forEach(func => {
      this[func] = this[func].bind(this);
    });
  }

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'status':
          column.render = (text, row) => {
            return row.status && <Status status={row.status.state} __={this.props.__} />;
          };
          break;
        case 'creator':
          column.render = (text, row) => {
            return row.createdBy;
          };
          break;
        case 'end_time':
          column.render = (text, row) => {
            return timeUtil(row.endsAt);
          };
          break;
        default:
          break;
      }
    });
  }

  setExpandedRowRender(table) {
    table.expandedRowRender = function(row) {
      return (
        <ExpandRow data={row} />
      );
    };
  }

  onInitialize() {
    this.getList();
  }

  getList() {
    this.clearState();
    let table = this.state.config.table;
    request.getList().then(res => {
      const selectedStatus = this.state.selectedStatus;
      if(selectedStatus !== 'all') {
      // 接口不支持过滤，所以人为过滤
        const filteredData = res.data.filter(item => {
          return item.status && item.status.state === selectedStatus;
        });

        table.data = filteredData;
        table.total = filteredData.length;
      } else {
        table.data = res.data;
        table.total = res.data.length;
      }

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
        this.onChangeOperation(data);
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
        popCreate({
          __: this.props.__,
          callback: () => {
            this.refresh();
          }
        });
        break;
      case 'maintain_cluster':
        popMaintainCluster(() => {
          this.refresh();
        });
        break;
      case 'maintain_server':
        popMaintainServer(() => {
          this.refresh();
        });
        break;
      case 'delete':
        if(isSingle) {
          popDelete(singleData, () => {
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

  onChangeOperation(data) {
    this.setState({
      selectedStatus: data.value
    }, () => {
      this.getList();
    });
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
    const isSingle = rows.length === 1 ? true : false;

    for(let key in btns) {
      switch(key) {
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
      <div className="garen-module-alert-silence">
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
