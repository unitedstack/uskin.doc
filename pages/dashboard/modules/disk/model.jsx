import './style/index.less';

import React from 'react';
import {Main, history} from 'ufec';
import config from './config.json';
import {Link} from 'react-router-dom';
import request from './request';
import __ from 'client/locale/dashboard.lang.json';

import Monitor from './detail/monitor/index';
import {SmartStateBoard, SmartState} from './detail/smart/index';
import Properties from 'client/components/basic_props/index';
import DetailTable from 'client/components/detail_table';

import unit from '../../utils/unit';


class Model extends React.Component {
  constructor(props) {
    super(props);

    this.tableColRender(config.table.columns);
    this.state = {
      config: config,
      page: 1
    };

    ['onAction', 'onInitialize', 'refresh'].forEach(m => this[m] = this[m].bind(this));
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
        case 'type':
          column.render = (col, item, i) => {
            return item.rotational ? __.rotational_disk : __.solid_state_disk;
          };
          break;
        case 'size':
          column.render = (col, item, i) => {
            return Math.ceil(unit.bytesToGB(item.size)) + ' GB';
          };
          break;
        case 'server':
          column.render = (col, item, i) => {
            return (
              <Link to={`/server/${item.server_id}`}>
                {item.server_id}
              </Link>
            );
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
      table.total = 1;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      table.total = 0;
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
        this.onSearchTable(data);
        break;
      default:
        break;
    }
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

  onClickBtnList(key, data, refs) {
    switch(key) {
      case 'refresh':
        this.refresh();
        break;
      default:
        break;
    }
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
        refs.loading(true, () => {
          contents[tabKey] = (
            <Properties __={this.props.__} properties={properties} />
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        break;
      case 'monitor':
        refs.loading(true, () => {
          contents[tabKey] = (
            <Monitor __={this.props.__} wwn={rows[0].wwn}/>
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        break;
      case 'smart_info':
        refs.loading(true, () => {
          let tableCfg;
          request.getSmart(rows[0].id).then(res => {
            tableCfg = this.getDetailTableCfg(res, rows[0].rotational);
            contents[tabKey] = (
              <div>
                <SmartStateBoard __={ this.props.__ } />
                <DetailTable table={tableCfg} __={this.props.__}/>
              </div>
            );
            refs.setState({
              loading: false,
              contents: contents
            });
          }
          );
        });
        break;
      default:
        break;
    }
  }

  getProperties(data) {
    const properties = [{
      title: 'wwn',
      content: data.id
    }, {
      title: 'disk_name',
      content: data.name
    }, {
      title: 'type',
      content: data.rotational ? __.rotational_disk : __.solid_state_disk
    }, {
      title: 'server',
      content: (
        <Link to={`/server/${data.server_id}`}>
          {data.server_id}
        </Link>
      )
    }, {
      title: 'size',
      content: Math.ceil(unit.bytesToGB(data.size)) + ' GB'
    }, {
      title: 'vender',
      content: data.vendor
    }, {
      title: 'model',
      content: data.model + '-' + data.serial
    }];
    return properties;
  }

  getDetailTableCfg(data, rotation) {
    const __ = this.props.__;
    // 判断状态函数
    function statusComfirmation(row) {
      let raw = Number(row.RAW_VALUE);
      let thresh = Number(row.THRESH);
      let current = Number(row.VALUE);
      let worst = Number(row.WORST);
      // 判断Reallocated_Sector_Ct项
      if (row.key === 'Reallocated_Sector_Ct'){
        if (rotation){
          if( raw > thresh ) {
            return [__.smart_error_state, __.smart_error_color];
          } else if(raw > 0) {
            return [__.smart_alert_state, __.smart_alert_color];
          } else {
            return [__.smart_health_state, __.smart_health_color];
          }
        } else {
          if(raw > thresh) {
            return [__.smart_error_state, __.smart_error_color];
          } else if(raw > 20) {
            return [__.smart_alert_state, __.smart_alert_color];
          } else {
            return [__.smart_health_state, __.smart_health_color];
          }
        }
      } else if(/Temperature/.test(row.key)){
        // 判断temperature
        if(current < thresh){
          return [__.smart_error_state, __.smart_error_color];
        } else if (current < 5) {
          return [__.smart_alert_state, __.smart_alert_color];
        } else {
          return [__.smart_health_state, __.smart_health_color];
        }
      } else {
        // 判断其他
        if(worst < thresh) {
          return [__.smart_error_state, __.smart_error_color];
        } else if (worst < 5) {
          return [__.smart_alert_state, __.smart_alert_color];
        } else {
          return [__.smart_health_state, __.smart_health_color];
        }
      }
    }
    const table = {
      columns: [{
        title: __.smart_no,
        dataIndex: 'number',
        render: (text, row, index) => {
          return index + 1;
        }
      }, {
        title: __.smart_state,
        dataIndex: 'state',
        render: (text, row) => {
          return row.key;
        }
      }, {
        title: __.smart_value,
        dataIndex: 'value',
        render: (text, row) => {
          return row.VALUE;
        }
      }, {
        title: __.smart_worst,
        dataIndex: 'worst',
        render: (text, row) => {
          return row.WORST;
        }
      }, {
        title: __.smart_critical,
        dataIndex: 'critical',
        render: (text, row) => {
          return row.THRESH;
        }
      }, {
        title: __.smart_raw,
        dataIndex: 'raw',
        render: (text, row) => {
          return row.RAW_VALUE;
        }
      }, {
        title: __.smart_status,
        dataIndex: 'status',
        render: (text, row) => {
          let status = statusComfirmation(row);
          return <SmartState state={status[0]} color={status[1]} />;
        }
      }],
      key: 'id',
      data: data
    };

    return table;
  }

  refresh() {
    if(this.state.config.table.loading) {
      return;
    }
    this.loadingTable();
    this.getList(this.state.page);
    //this.getList();
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
      <div className="garen-module-disk">
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