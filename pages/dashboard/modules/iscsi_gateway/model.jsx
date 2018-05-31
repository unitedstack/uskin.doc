import './style/index.less';

import React from 'react';
import {Main} from 'ufec';
import config from './config.json';
import request from './request';
import Status from 'client/components/status_with_circle/index';

// detail
import Properties from 'client/components/basic_props/index';
import DetailTable from 'client/components/detail_table/index';
import Monitor from './detail/monitor/index';


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

  onInitialize() {
    // 不支持单个获取
    this.getList();
  }

  tableColRender(columns) {
    const __ = this.props.__;
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'status':
          column.render = (te, row) => {
            const text = row.state === 'active' ? __.available : __.unavailable;
            const customCfg = {
              color: row.state === 'active' ? '#29cd7b' : '#939ba3',
              circle: row.state === 'active' ? '#29cd7b' : '#939ba3'
            };
            return (
              <Status text={text} size="normal" customCfg={customCfg} />
            );
          };
          break;
        case 'gateway_address':
          column.render = (text, row) => {
            return row.portal_ip_address;
          };
          break;
        case 'number_of_volumes':
          column.render = (text, row) => {
            return row.active_luns;
          };
          break;
        default:
          break;
      }
    });
  }

  getList() {
    this.clearState();
    let table = this.state.config.table;
    request.getList(this.state.page).then(res => {
      table.data = res;
      table.total = res.length;
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
    const gatewayInfo = data.rows[0];

    if(gatewayInfo === undefined) {
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
          request.getCPUAndMemoryData(gatewayInfo.uuid).then(res => {
            const properties = this.getProperties(gatewayInfo);
            const tableCfg = this.getDetailTableCfg([{...res, key: 'key'}]);
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
        });
        break;
      case 'monitor':
        refs.loading(true, () => {
          contents[tabKey] = (
            <div>
              <Monitor __={this.props.__} id={gatewayInfo.uuid} />
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
    const { __ } = this.props;
    const text = data.state === 'active' ? __.available : __.unavailable;
    const customCfg = {
      color: data.state === 'active' ? '#29cd7b' : '#939ba3',
      circle: data.state === 'active' ? '#29cd7b' : '#939ba3'
    };
    const properties = [{
      title: 'name',
      content: data.name
    }, {
      title: 'status',
      formatter: <Status text={text} size="normal" customCfg={customCfg} />
    }, {
      title: 'gateway_address',
      content: data.portal_ip_address
    }, {
      title: 'number_of_volumes',
      content: data.active_luns,
    }];
    return properties;
  }

  getDetailTableCfg(data) {
    const __ = this.props.__;
    const table = {
      columns: [{
        title: __.cpu_usage,
        dataIndex: 'cpu',
        render: (text, row) => {
          return row.cpu;
        }
      }, {
        title: __.memory_usage,
        dataIndex: 'memory',
        render: (text, row) => {
          return row.memory;
        }
      }],
      data: data
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
    if(this.state.config.table.loading) {
      return;
    }
    this.loadingTable();
    this.getList();
  }


  dashboard = React.createRef();

  render() {
    const state = this.state;
    const props = this.props;
    return (
      <div className="garen-module-iscsi-gateway">
        <Main
          ref={ this.dashboard }
          config={state.config}
          onAction={this.onAction}
          onInitialize={this.onInitialize}
          __={props.__}
        />
      </div>
    );
  }

}

export default Model;
