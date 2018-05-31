import './style/index.less';

import React from 'react';
import {Main} from 'ufec';
import config from './config.json';
import request from './request';
import ExpandRow from './expand_row';
import { Link } from 'react-router-dom';

// pop
import popCreateGroup from './pop/create/index';
import popDeleteGroup from './pop/delete/index';
import popEditClientGroup from './pop/edit_client_group/index';
import popAssociateVolumes from './pop/associate_volumes/index';

class Model extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      config: config,
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
        case 'client':
          column.render = (text, row) => {
            if(row.members.length !== 0) {
              return (
                <Link to={`/iscsi_mgmt/${row.members[0]}`}>
                  {row.members[0]}
                </Link>
              );
            } else {
              return null;
            }
          };
          break;
        case 'block_storage_volume':
          column.render = (text, row) => {
            if(row.disks.length !== 0) {
              return (
                <Link to={`/block_mgmt/${row.disks[0].id}`}>
                  {row.disks[0].name}
                </Link>
              );
            } else {
              return null;
            }
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
        popCreateGroup(null, () => {
          this.refresh();
        });
        break;
      case 'edit_client_group':
        if(isSingle) {
          popEditClientGroup(singleData, () => {
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
          popDeleteGroup(singleData, () => {
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
        case 'edit_client_group':
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
      <div className="garen-module-client-group">
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
