import './style/index.less';

import React from 'react';
import {Main} from 'ufec';
import config from './config.json';
import request from './request';
import LevelStatus from 'client/components/status_with_circle/index';
import Status from './components/status';
import timeUtil from '../../utils/time_format';
import clone from 'client/utils/deep_clone';

class Model extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // 为了避免重复翻译下拉框内容导致的空白，这里对副本进行操作
      config: clone(config),
      countObj: {
        informational: 0,
        warning: 0,
        major: 0,
        critical: 0,
        unread: 0
      },
      serverList: [],
      serverListMap: {},  // 这个 map 是为了方便在表格中查找服务器名字
      selectedResource: 'all',
      selectedLevel: 'all',
      selectedServer: 'all',
      selectedStatus: 'all',
      page: 1
    };

    this.colorMap = {
      informational: '#1CAFC6',
      warning: '#FCA625',
      major: '#F04134',
      critical: '#C3180B'
    };

    this.tableColRender(this.state.config.table.columns);
    this.translateAndAddCountForOperations(this.state.config.operations);

    ['onInitialize','onAction'].forEach(func => {
      this[func] = this[func].bind(this);
    });
  }

  tableColRender(columns) {
    const __ = this.props.__;
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'alert_level':
          column.render = (te, row) => {
            const cfg = {
              size: 'large',
              customCfg: {
                color: '#252F3D',
                marginLeft: '10px'
              }
            };
            let text, circle;

            switch(row.severity) {
              case 'informational':
                text = __.information;
                circle = '#29CD7B';
                break;
              case 'warning':
                text = __.warning;
                circle = '#FCA625';
                break;
              case 'major':
                text = __.serious;
                circle = '#F04134';
                break;
              case 'critical':
                text = __.disaster;
                circle = '#C3180B';
                break;
              default:
                break;
            }

            cfg.text = text;
            cfg.customCfg.circle = circle;
            return <LevelStatus {...cfg} />;
          };
          break;
        case 'status':
          column.render = (text, row) => {
            return (
              <Status __={__} status={row.status}
                onMarkAsRead={row.status==='open' ? this.markAsRead.bind(this,row.id) : null}/>
            );
          };
          break;
        case 'last_received_time':
          column.render = (text, row) => {
            return timeUtil(row.lastReceiveTime);
          };
          break;
        case 'repeat_times':
          column.render = (text, row) => {
            return row.duplicateCount;
          };
          break;
        case 'server':
          column.render = (text, row) => {
            const server = row.tags.find(tag => {
              return tag.includes('host_id=');
            });
            if(server !== undefined) {
              let id = server.split('=')[1];
              return this.state.serverListMap[id] && this.state.serverListMap[id].name;
            } else {
              return null;
            }
          };
          break;
        case 'process_name':
          column.render = (text, row) => {
            return row.service.join();
          };
          break;
        case 'value':
          column.render = (text, row) => {
            return 'N/A';
          };
          break;
        case 'alert_content':
          column.render = (text, row) => {
            return row.text;
          };
          break;
        default:
          break;
      }
    });
  }

  markAsRead(id) {
    request.markAsRead(id).finally(() => {
      this.refresh();
    });
  }

  translateAndAddCountForOperations(ops) {
    const countStyle = {
      display: 'inline-block',
      width: 40,
      lineHeight: '18px',
      color: '#fff',
      borderRadius: 100,
      marginLeft: 10,
      textAlign: 'center'
    };
    const { __ } = this.props;
    ops[1].data = ops[1].data.map((item, index)=> {
      return {
        ...item,
        suffix: index !== 0 && (
          <div style={{...countStyle, background: this.colorMap[item.value]}}>
            {this.state.countObj[item.value]}
          </div>
        )
      };
    });
    ops[2].data = ops[2].data.map(item => {
      return {
        value: item.value,
        name: __[item.name]
      };
    });
    ops[3].data[1].suffix = (
      <div style={{...countStyle, background: this.colorMap.informational}}>
        {this.state.countObj.unread}
      </div>
    );
  }

  onInitialize() {
    this.getCountAndServerList();
    // getList 在上面函数中的 setState 的回调里
  }

  // 获取操作栏中下拉框的告警条数和服务器列表
  getCountAndServerList() {
    request.getCountAndServerList().then(res => {
      this.setState({
        countObj: res.count,
        serverList: res.servers,
        serverListMap: this.setServerMapByList(res.servers)
      }, () => {
        this.updateSelect(this.state);
        // 把 getList 写到这里是为了保证在渲染表格时 state 中已经有服务器列表的数据了
        this.getList();
      });
    });
  }

  setServerMapByList(list) {
    const map = {};
    list.forEach(server => {
      map[server.id] = server;
    });
    return map;
  }

  updateSelect(state) {
    const newConfig = state.config;
    const countStyle = {
      display: 'inline-block',
      width: 40,
      height: 18,
      lineHeight: '16px',
      color: '#fff',
      borderRadius: 100,
      paddingTop: 1,
      marginLeft: 10,
      textAlign: 'center'
    };
    newConfig.operations[1].data.forEach((item, index) => {
      item.suffix = index !== 0 && (
        <div style={{...countStyle, background: this.colorMap[item.value]}}>
          {state.countObj[item.value]}
        </div>
      );
    });

    newConfig.operations[2].data = [newConfig.operations[2].data[0]];
    state.serverList.forEach(item => {
      newConfig.operations[2].data.push({
        value: item.id,
        name: item.name
      });
    });

    newConfig.operations[3].data[1].suffix = (
      <div style={{...countStyle, background: this.colorMap.informational}}>
        {state.countObj.unread}
      </div>
    );

    this.setState({
      config: newConfig
    });
  }

  getList() {
    const state = this.state;
    this.clearState();
    let table = state.config.table;
    request.getList(state.page, state.selectedResource, state.selectedLevel, state.selectedServer, state.selectedStatus).then(res => {
      table.data = res.alerts;
      table.total = res.total;
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
        this.onChangeOperation(actionType, data);
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

  onChangeOperation(type, data) {
    switch (type) {
      case 'select':
        this.onChangeSelect(data);
        break;
      case 'checkbox':
        this.onChangeCheckbox(data);
        break;
      default:
        break;
    }
  }

  onChangeSelect(data) {
    const newConfig = this.state.config;

    if(data.key === 'resource') {
      newConfig.operations[2].disabled = (data.value !== 'all' && data.value !== 'server') ?
        true : false;
    } else {
      newConfig.operations[2].disabled = (this.state.selectedResource !== 'all' &&
        this.state.selectedResource) ? true : false;
    }

    switch (data.key) {
      case 'resource':
        this.setState({
          selectedResource: data.value,
          config: newConfig
        }, this.getList);
        break;
      case 'level':
        this.setState({
          selectedLevel: data.value,
          config: newConfig
        }, this.getList);
        break;
      case 'server':
        this.setState({
          selectedServer: data.value,
          config: newConfig
        }, this.getList);
        break;
      default:
        break;
    }
  }

  onChangeCheckbox(data) {
    const newConfig = this.state.config;
    newConfig.operations[3].data.forEach(item => {
      item.checked = item.value === data.value;
    });

    if(data.key === 'status') {
      this.setState({
        selectedStatus: data.value,
        config: newConfig
      }, this.getList);
    }
  }

  onClickPagination(data) {
    const { page } = data;
    this.loadingTable();
    this.setState({
      page: page
    }, () => {
      this.getCountAndServerList();
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
    this.getCountAndServerList();
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
      <div className="garen-module-alert">
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
