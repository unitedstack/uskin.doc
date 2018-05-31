import './style/index.less';

import React from 'react';
import {Main, history} from 'ufec';
import config from './config.json';
import request from './request';
//import __ from 'client/locale/dashboard.lang.json';
import Properties from 'client/components/basic_props/index';

import moment from 'moment';
import RSVP from 'rsvp';
import utilConverter from '../../utils/unit_converter';

import Monitor from './detail/monitor/index';

let unlisten;

class Model extends React.Component {

  constructor(props) {
    super(props);
    this.tableColRender(this.state.config.table.columns);
    ['onInitialize', 'onAction'].forEach(func => {
      this[func] = this[func].bind(this);
    });

    this.timer = null;
    unlisten = history.listen((location) => {
      let path = history.getPathList();
      if (path.length === 1 && path[0] === 's3_gateway') {
        this.getList();
      } else if (path.length > 1 && path[0] === 's3_gateway') {
        this.timer && clearInterval(this.timer);
        this.timer = null;
      }
    });
  }

  state = {
    config: config
  };

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
    unlisten();
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
    this.reqPost();
    this.timer = setInterval(() => {
      this.setState({
        loading: true
      });
      this.reqPost();
    }, 10000);
  }

  reqPost() {
    let arr = [], keys;
    let table = this.state.config.table;
    request.getList(moment().unix()).then(res => {
      arr = [];
      RSVP.hash(res).then(r => {
        keys = Object.keys(r);
        keys.forEach(key => {
          arr.push(r[key]);
        });
        table.data = arr;
        this.updateTableData(table);
      });
    }).catch(err => {
      table.data = [];
      this.updateTableData(table);
    });
  }

  onAction(field, actionType, data, refs) {
    switch(field) {
      case 'btnList':
        this.onClickBtnList(data.key, actionType, data, refs);
        break;
      case 'detail':
        this.onClickDetailTabs(data.key, data, refs);
        break;
      default:
        break;
    }
  }

  onClickBtnList(key, actionType, data, refs) {
    switch(key) {
      case 'refresh':
        this.refresh();
        break;
      default:
        break;
    }
  }

  btnListRender(rows, btns) {
    for (let key in btns) {
      switch (key) {
        case 'refresh':
          btns[key].disabled = false;
          break;
        default:
          break;
      }
    }
    return btns;
  }

  getProperties(item) {
    const properties = [{
      title: ['gateway_port'],
      content: item.protocol + '://' + item.host + ':' + item.port
    }];
    return properties;
  }

  onClickDetailTabs(tabKey, data, refs) {
    let contents = refs.state.contents;
    const {rows} = data;
    const properties = this.getProperties(rows[0]);

    switch(tabKey) {
      case 'description':
        refs.loading(true, () => {
          contents[tabKey] = (
            <div>
              <Properties __={this.props.__} properties={properties} />
              <Monitor __={this.props.__} id={rows[0].id} />
            </div>
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        refs.setState({
          loading: false,
          contents: contents
        });
        break;
      default:
        break;
    }
  }

  getUnit(data) {
    let unit = utilConverter(Math.round(data * 100).toFixed(2) / 100);

    return unit.num + ' ' + unit.unit + '/s';
  }

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.key) {
        case 'gateway_port':
          column.formatter = (text, row) => {
            return row.protocol + '://' + row.host + ':' + row.port;
          };
          break;
        case 'read_bandwidth':
          column.render = (col, item, i) => {
            return this.getUnit(item.bandwidthRead);
          };
          break;
        case 'write_bandwidth':
          column.render = (col, item, i) => {
            return this.getUnit(item.bandwidthWrite);
          };
          break;
        case 'read_iops':
          column.render = (col, item, i) => {
            return Math.round(item.readIops * 100).toFixed(2) / 100;
          };
          break;
        case 'write_iops':
          column.render = (col, item, i) => {
            return Math.round(item.writeIops * 100).toFixed(2) / 100;
          };
          break;
        case 'cpu_usage':
          column.render = (col, item, i) => {
            return Math.round(item.cpu * 100).toFixed(2) / 100 + '%';
          };
          break;
        case 'memory_usage':
          column.render = (col, item, i) => {
            return Math.round(item.memery * 100).toFixed(2) / 100 + '%';
          };
          break;
        default:
          break;
      }
    });
  }

  refresh() {
    if(this.state.config.table.loading) {
      return;
    }
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

  getSingle(id) {
    this.clearState();
    let table = this.state.config.table;
    request.getSingle(id, moment().unix()).then(res => {
      table.data = [res];
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

  clearState() {
    const dashboardRef = this.dashboard.current;
    if(dashboardRef) {
      dashboardRef.clearState();
    }
  }

  dashboard = React.createRef();

  render() {
    const state = this.state;
    const props = this.props;
    return (
      <div className="garen-module-gateway">
        <Main
          ref={ this.dashboard }
          config={state.config}
          btnListRender={this.btnListRender}
          onAction={this.onAction}
          onInitialize={this.onInitialize}
          __={props.__}
        />
      </div>
    );
  }
}

export default Model;
