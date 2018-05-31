import './style/index.less';

import React from 'react';
import {Main, history} from 'ufec';
import config from './config.json';
import request from './request';
import Status from 'client/components/status_with_circle/index';
import CapacityUse from './components/capacity_use/index';
import { Link } from 'react-router-dom';
import utilConverter from '../../utils/unit_converter';

// detail
import Properties from 'client/components/basic_props/index';
import Monitor from './detail/monitor/index';
import CapacityUseChart from './components/capacity_use_chart/index';

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
    const { __ } = this.props;
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'name':
          column.formatter = (text, row) => {
            return row.name;
          };
          break;
        case 'capacity_use':
          column.render = (text, row) => {
            return (
              <CapacityUse used={row.kb_used} total={row.kb} />
            );
          };
          break;
        case 'belong_pool':
          column.render = (text, row) => {
            return (
              row.pool_name && <Link to={`/pool/${row.pool_name}`}>
                {row.pool_name}
              </Link>
            );
          };
          break;
        case 'disk':
          column.render = (text, row) => {
            return (
              row.disk && <Link to={`/disk/${row.disk}`}>
                {row.disk}
              </Link>
            );
          };
          break;
        case 'process_status':
          column.render = (text, row) => {
            let content;
            if(row.status.toLowerCase() === 'up') {
              content = __.available;
            } else {
              content = __.unavailable;
            }

            const customCfg = {
              color:'#6c777a',
              circle: '#29cd7b',
              fontSize: '12px',
              lineHeight: '16px'
            };
            return <Status customCfg={customCfg} size='normal' text={content}/>;
          };
          break;
        case 'status_of_use':
          column.render = (text, row) => {
            return row.reweight === 0 ? 'OUT' : 'IN';
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
    const osdId = data.rows[0] && data.rows[0].id;
    if(osdId === undefined) {
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
      case 'monitor':
        refs.loading(true, () => {
          contents[tabKey] = (
            <Monitor osdId={osdId} __={this.props.__}/>
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        break;
      case 'properties':
        refs.loading(true, () => {
          const properties = this.getProperties(data.rows[0]);
          contents[tabKey] = (
            <div>
              <Properties __={this.props.__} properties={properties} />
              <CapacityUseChart __={this.props.__} data={data.rows[0]} />
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
    const __ = this.props.__;
    const usedObj = utilConverter(data.kb_used, 'KB');

    let processStatus;
    if (data.status.toLowerCase() === 'up') {
      processStatus = __.available;
    } else {
      processStatus = __.unavailable;
    }
    const customCfg = {
      color: '#6c777a',
      circle: '#29cd7b',
      fontSize: '12px',
      lineHeight: '16px'
    };

    const properties = [{
      title: 'name',
      content: data.name
    }, {
      title: 'used_capacity',
      content: usedObj.num + usedObj.unit
    }, {
      title: 'belong_pool',
      content: data.pool_name,
      link: data.pool_name && `/pool/${data.pool_name}`,
    }, {
      title: 'disk',
      content: data.disk,
      link: data.disk && `/disk/${data.disk}`
    }, {
      title: 'process_status',
      formatter: <Status customCfg={customCfg} size='small' text={processStatus} />
    }, {
      title: 'status_of_use',
      content: data.reweight === 0 ? 'OUT' : 'IN'
    }];
    return properties;
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
      <div className="garen-module-osd-list">
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
