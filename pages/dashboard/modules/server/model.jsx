import './style/index.less';

import React from 'react';
import {Main, history} from 'ufec';
import config from './config.json';
import {Link} from 'react-router-dom';
import request from './request';
import __ from 'client/locale/dashboard.lang.json';


import utilConverter from '../../utils/unit_converter';
// import moment from 'moment';
import Properties from 'client/components/basic_props/index';
import DetailTable from 'client/components/detail_table';

import Monitor from './detail/monitor/index';

// import timeUtil from '../../utils/time_format';
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

      switch (column.dataIndex) {
        case 'name':
          column.formatter = (text, row) => {
            return row.instance_info && row.instance_info.display_name
              || row.id;
          };
          break;
        case 'ipmi':
          column.render = (text, row) => {
            return (row.driver_info && row.driver_info.ipmi_address) ?
              (
                <a href={'//' + row.driver_info.ipmi_address} target="_blank">
                  {row.driver_info.ipmi_address}
                </a>
              ) : null;
          };
          break;
        case 'disk_num':
          column.render = (col, item, i) => {
            if (item.inventory && item.inventory.disks) {
              return item.inventory.disks.length;
            }
            return 0;
          };
          break;
        case 'status':
          column.render = (te, row) => {
            const { __ } = this.props;
            const circleStyle = {
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: 3,
              marginRight: 8,
              verticalAlign: '1.5px'
            };

            const textStyle = {
              display: 'inline-block',
              lineHeight: '16px'
            };

            let bgColor, color, text;

            switch (row.status) {
              case 'up':
                bgColor = '#29cd7b';
                color = '#29cd7b';
                text = __.health;
                break;
              case 'down':
                bgColor = '#FCA625';
                color = '#FCA625';
                text = __.unhealthy;
                break;
              case 'unknown':
                bgColor = '#939ba3';
                color = '#939ba3';
                text = __.unknown;
                break;
              default:
                break;
            }

            circleStyle.backgroundColor = bgColor;
            textStyle.color = color;

            return (
              <div>
                <span style={circleStyle}></span>
                <span style={textStyle}>{text}</span>
              </div>
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
      table.count = 1;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      table.count = 0;
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
        this.onClickSearch(data);
        break;
      default:
        break;
    }
  }

  onClickSearch(data) {
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
            <Monitor __={this.props.__} id={rows[0].id} />
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        break;
      case 'disk':
        refs.loading(true, () => {
          const tableCfg = this.getDetailTableCfg(rows[0].inventory.disks || []);
          contents[tabKey] = (
            <DetailTable table={tableCfg} __={this.props.__}/>
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
    const _memoryObject =  utilConverter(data.inventory.memory.physical_mb, 'MB');

    const { __ } = this.props;
    const circleStyle = {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 8,
      verticalAlign: '1.5px'
    };

    const textStyle = {
      display: 'inline-block',
      lineHeight: '16px'
    };

    let bgColor, color, text;

    switch (data.status) {
      case 'up':
        bgColor = '#29cd7b';
        color = '#29cd7b';
        text = __.health;
        break;
      case 'down':
        bgColor = '#FCA625';
        color = '#FCA625';
        text = __.unhealthy;
        break;
      case 'unknown':
        bgColor = '#939ba3';
        color = '#939ba3';
        text = __.unknown;
        break;
      default:
        break;
    }

    circleStyle.backgroundColor = bgColor;
    textStyle.color = color;

    const properties = [{
      title: 'id',
      content: data.id
    }, {
      title: 'status',
      formatter: (
        <div>
          <span style={circleStyle}></span>
          <span style={textStyle}>{text}</span>
        </div>
      )
    }, {
      title: 'memory',
      content: _memoryObject.num + _memoryObject.unit
    }, {
      title: 'cpu',
      content: data.inventory.cpu.model_name
    }, {
      title: 'cpu_num',
      content: data.inventory.cpu.count
    }, {
      title: 'disk_num',
      content: data.inventory.disks.length
    }, {
      title: 'ipmi',
      content: (
        <a href={'//' + data.driver_info.ipmi_address} target="_blank">
          {data.driver_info.ipmi_address}
        </a>
      )
    }];
    return properties;
  }

  getDetailTableCfg(data) {
    const __ = this.props.__;
    const table = {
      rowKey: 'id',
      columns: [{
        title: __.disk_name,
        key: 'name',
        dataIndex: 'name',
        render: (text, row) => {
          return (
            <Link to={`/disk/${row.id}`}>
              {row.name}
            </Link>
          );
        }
      }, {
        title: __.wwn,
        key: 'id',
        dataIndex: 'id',
        render: (text, row) => {
          return row.id;
        }
      }, {
        title: __.capacity,
        'key': 'size',
        dataIndex: 'size',
        render: (text, row) => {
          return Math.ceil(unit.bytesToGB(row.size)) + 'GB';
        }
      }],
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
      <div className="garen-module-server">
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