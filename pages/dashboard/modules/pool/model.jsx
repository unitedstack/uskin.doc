import './style/index.less';

import React from 'react';
import {Main, history} from 'ufec';
import config from './config.json';
import request from './request';
import __ from 'client/locale/dashboard.lang.json';
import ModifyOsd from './pop/modify_osd/index';
import createPool from './pop/create/index';
import modifyPool from './pop/modify_pool/index';
import createRelatedPool from './pop/create_related_pool/index';
import deleteRelatedPool from './pop/delete_related_pool/index';
import deletePool from './pop/deletePool/index';
import utilConverter from '../../utils/unit_converter';
import Properties from 'client/components/basic_props/index';
import { Progress, Table } from 'antd';
import { Link } from 'react-router-dom';
import Monitor from './detail/monitor/index';
import event from '../../cores/event';
import PropertyMonitor from './detail/property_monitor/index';
import CapacityUse from './detail/capacity_use/index';
import ActualCapacity from './detail/actual_capacity/index';

const coldPool = 'metadata,data,block,cloud,iscsi';
const hotPool = 'cache';
import Status from 'client/components/status_with_circle/index';

class Model extends React.Component {
  constructor(props) {
    super(props);

    this.tableColRender(config.table.columns);

    this.state = {
      config: config,
      page: 1,
      currentType: coldPool
    };

    ['onAction', 'onInitialize', 'btnListRender', 'refresh'].forEach(m => this[m] = this[m].bind(this));
  }

  componentDidMount() {
    event.on('message', data => {
      if (data.resourceType === 'pool') {
        if(data.stage === 'end') {
          this.refresh();
        }
      }
    });
  }

  componentWillUnmount() {
    event.off(['message']);
  }

  onInitialize() {
    const path = history.getPathList();
    if(path.length > 1) {
      this.getSingle(path[1]);
    } else {
      this.updatePool(() => {
        this.getList();
      });
    }
  }

  updatePool(cb, value) {
    let _config = this.state.config;
    const operations = [{
      name: 'data_pool',
      value: coldPool
    }, {
      name: 'cache_pool',
      value: hotPool
    }];
    _config.operations[0].data = operations;
    if(value) {
      _config.operations[0].value = value;
    }
    this.setState({
      config: _config
    }, () => {
      delete this.state.config.operations[0].value;
      cb();
    });
  }

  tableColRender(columns) {
    columns.map((column) => {
      switch (column.key) {
        case 'use':
          column.render = (col, item, i) => {
            return this.getUserData(item);
          };
          break;
        case 'capacity':
          let maxAvail = 0,
            percent = 0,
            used = 0,
            status = 'active';
          column.render = (col, item, i) => {
            maxAvail = item.stats ? item.stats.max_avail : 0;
            used = item.stats.bytes_used || 0;
            if ((used + maxAvail) !== 0) {
              percent = (used / (used + maxAvail)) * 100;
            }
            status = percent > 80 ? 'exception' : 'active';
            return <div>
              <div style={{'fontSize': '8px', 'color': '#999', 'lineHeight': '18px'}}>
                {utilConverter(used).num + ' ' + utilConverter(used).unit}
              </div>
              <Progress percent={percent} showInfo={false} status={status}/>
              <div style={{'fontSize': '8px', 'color': '#999', 'lineHeight': '18px'}}>
                {__.total_cap + ' ' + utilConverter(used + maxAvail).num + ' ' + utilConverter(used + maxAvail).unit}
              </div>
            </div>;
          };
          break;
        case 'domain_type':
          column.render = (col, item, i) => {
            return this.getDomainType(item.crush_failure_domain);
          };
          break;
        case 'disk_num':
          column.render = (col, item, i) => {
            return item.osds ? item.osds.length : 0;
          };
          break;
        case 'redundancy':
          column.render = (col, item, i) => {
            return item.strategy.constructor === String ? item.strategy : item.strategy + (item.strategy === 1 ? __.copy : __.copies);
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
    request.getSingle(id).then(res => {
      table.data = [res];
      this.setState({
        currentType: res.metadata_type !== hotPool ? coldPool : hotPool
      }, () => {
        this.updatePool(() => {
          this.updateTableData(table);
        }, this.state.currentType);
      });
    }).catch(err => {
      table.data = [];
      this.updateTableData(table);
    });
  }

  getList(page) {
    this.clearState();
    let table = this.state.config.table;
    request.getList(this.state.currentType, page).then(res => {
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
      case 'operation':
        this.onClickOperationList(actionType, data.key, data);
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

  onClickOperationList(operationType, key, data) {
    switch(operationType) {
      case 'select':
        this.onClickSelect(key, data);
        break;
      default:
        break;
    }
  }

  onClickSelect(key, data) {
    switch(key) {
      case 'pool':
        this.loadingTable();
        this.setState({
          currentType: data.value,
          page: 1
        }, () => {
          this.getList();
        });
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
    const { rows } = data;
    switch(key) {
      case 'modify_osd':
        ModifyOsd(rows[0], null);
        break;
      case 'create':
        createPool();
        break;
      case 'modify_pool':
        modifyPool(null, rows[0]);
        break;
      case 'create_related_pool':
        createRelatedPool(rows[0], false, this.state.currentType);
        break;
      case 'modify_related_pool':
        createRelatedPool(rows[0], true, this.state.currentType);
        break;
      case 'delete_related_pool':
        deleteRelatedPool(this.state.currentType, this.props, rows[0]);
        break;
      case 'delete':
        deletePool(this.state.currentType, this.props, rows);
        break;
      case 'refresh':
        this.refresh();
        break;
      default:
        break;
    }
  }

  btnListRender(rows, btns) {
    const state = this.state;
    const isDatePool = state.currentType === 'metadata,data,block,cloud,iscsi';
    const isCachePool = state.currentType === 'cache';
    for (let key in btns) {
      switch (key) {
        case 'modify_pool':
        case 'modify_osd':
          btns[key].disabled = (rows.length === 1) ? false : true;
          break;
        case 'create_related_pool':
          if(isDatePool) {
            btns[key].disabled = rows.length === 1 && !(rows[0].tiernames.length > 0 && rows[0].tiers.length > 0) ? false : true;
          } else if(isCachePool) {
            btns[key].disabled = rows.length === 1 && !(rows[0].tiername_of && ( rows[0].tier_of || rows[0].tier_of === 0) ) ? false : true;
          }
          break;
        case 'modify_related_pool':
        case 'delete_related_pool':
          if(isDatePool) {
            btns[key].disabled = (rows.length === 1 && rows[0].tiernames.length > 0 && rows[0].tiers.length > 0) ? false : true;
          } else if(isCachePool) {
            btns[key].disabled = (rows.length === 1 && rows[0].tiername_of && ( rows[0].tier_of || rows[0].tier_of === 0) ) ? false : true;
          }
          break;
        case 'delete':
          btns[key].disabled = (rows.length >= 1) ? false : true;
          break;
        default:
          break;
      }
    }
    return btns;
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
    const properties = rows[0] ? this.getProperties(rows[0]): [];
    switch(tabKey) {
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
      case 'description':
        refs.loading(true, () => {
          request.getDataStatus(rows[0].id).then(res => {
            contents[tabKey] = (
              <div>
                <Properties __={this.props.__} properties={properties} />
                <div className="cluster-data">
                  <ActualCapacity __={this.props.__} data={rows[0]} />
                  <CapacityUse __={this.props.__}
                    data={{unused: Number(rows[0].stats.max_avail), used: Number(rows[0].stats.bytes_used), total: Number(rows[0].stats.max_avail) + Number(rows[0].stats.bytes_used)}} />
                  <PropertyMonitor __={this.props.__} data={res}/>
                </div>
              </div>
            );
            refs.setState({
              loading: false,
              contents: contents
            });
          });
        });
        break;
      case 'related_osd':
        refs.loading(true, () => {
          request.getOsdList(rows[0].metadata_class).then(res => {
            const columns = [{
              'title': __.name,
              'key': 'name',
              'dataIndex': 'name',
              render: (text, rows) => {
                return (
                  <Link to={`/osd_mgmt/${rows.name}`}>
                    { rows.name }
                  </Link>
                );
              }
            }, {
              'title': __.process_status,
              'key': 'process_status',
              'dataIndex': 'process_status',
              render: (text, row) => {
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
                return <Status customCfg={customCfg} size='small' text={content}/>;
              }
            }, {
              'title': __.status_of_use,
              'key': 'status_of_use',
              'dataIndex': 'status_of_use',
              render: (text, row) => {
                return row.reweight === 0 ? 'OUT' : 'IN';
              }
            }, {
              'title': __.size,
              'key': 'size',
              'dataIndex': 'size',
              render: (text, rows) => {
                let used = rows.kb_used;
                let all = rows.kb;
                let percent = parseInt((used / all) * 100);
                let status = percent > 80 ? 'exception' : 'active';
                return (
                  <div>
                    <div className="progress-usage"><span style={{'fontSize': '10px'}}>{utilConverter(used, 'KB').num + utilConverter(used, 'KB').unit}</span>
                      <span style={{'float': 'right', 'fontSize': '10px'}}>{utilConverter(all, 'KB').num + utilConverter(all, 'KB').unit}</span></div>
                    <Progress percent={percent} style={{width: '100%'}} showInfo={false} status={status}/>
                  </div>
                );
              }
            }, {
              'title': __.belong_server,
              'key': 'belong_server',
              'dataIndex': 'belong_server',
              render: (text, rows) => {
                return (
                  rows.pool_name && <Link to={`/disk/${rows.disk}`}>
                    {rows.disk === 'null' ? '' : rows.disk}
                  </Link>
                );
              }
            }];
            contents[tabKey] = (
              <Table
                rowKey='id'
                loading={false}
                locale={{emptyText: __.no_data}}
                pagination={false}
                columns={columns}
                style={{marginTop: 14}}
                dataSource={res.data}>
              </Table>
            );
            refs.setState({
              loading: false,
              contents: contents
            });
          });
        });
        break;
      case 'related_pool':
        if(this.state.currentType === coldPool) {
          if(rows[0].tiernames.length > 0) {
            refs.loading(true, () => {
              if(this.state.currentType === coldPool) {
                request.getSingle(rows[0].tiernames[0]).then(res => {
                  contents[tabKey] = (
                    <Properties __={this.props.__} title="related_pool" properties={this.getRelatedPoolProperties(res, true)} />
                  );
                  refs.setState({
                    loading: false,
                    contents: contents
                  });
                });
              }
            });
          } else {
            contents[tabKey] = <div className="detail-no-data">{this.props.__.no_related_pool}</div>;
            refs.setState({
              loading: false,
              contents: contents
            });
          }
        } else if(this.state.currentType === hotPool) {
          if(rows[0].tiername_of) {
            contents[tabKey] = (
              <Properties __={this.props.__} title="related_pool" properties={this.getRelatedPoolProperties(rows[0], false)} />
            );
            refs.setState({
              loading: false,
              contents: contents
            });
          } else {
            contents[tabKey] = <div className="detail-no-data">{this.props.__.no_related_pool}</div>;
            refs.setState({
              loading: false,
              contents: contents
            });
          }
        }
        break;
      default:
        break;
    }
  }

  getUserData(item) {
    let keys = Object.keys(item.application_metadata);
    switch(item.application_metadata[keys[0]] && item.application_metadata[keys[0]].type) {
      case 'cloud':
        return __.cloud_pool;
      case 'block':
        return __.block_pool;
      case 'data':
        return __.object_pool;
      case 'metadata':
        return __.metadata_pool;
      case 'cache':
        return __.cache_pool;
      case 'iscsi':
        return __.iscsi_pool;
      default:
        return '';
    }
  }

  getDomainType(item) {
    if (item) {
      switch(item) {
        case 'datacenter':
          return __.data_center;
        case 'rack':
          return __.rack;
        case 'host':
          return __.host;
        default:
          return '';
      }
    } else {
      return '';
    }
  }

  getProperties(data) {
    let maxAvail = data.stats && data.stats.max_avail || 0;
    let used = data.stats && data.stats.bytes_used || 0;
    const nodelete = data.params && data.params.nodelete === 'true' ? 'protected' : 'unprotected';
    const pgProtect = data.params && data.params.nopgchange === 'true' ? 'protected' : 'unprotected';
    const copyProtect = data.params && data.params.nosizechange === 'true' ? 'protected' : 'unprotected';
    const check = data.params && data.params.noscrub === 'true' ? 'not_closed' : 'closed';
    const depthCheck = data.params && data.params['nodeep-scrub'] === 'true' ? 'not_closed' : 'closed';
    const properties = [{
      title: 'name',
      content: data.pool_name
    }, {
      title: 'capacity',
      content: utilConverter(maxAvail + used).num + ' ' + utilConverter(maxAvail + used).unit
    }, {
      title: 'capacity_threshold',
      content: ((used / (maxAvail + used)) * 100).toFixed(2) + ' %'
    }, {
      title: 'domain_type',
      content: this.getDomainType(data.crush_failure_domain)
    }, {
      title: 'redundancy',
      content: data.strategy && data.strategy.constructor === String ? data.strategy : data.strategy + __.copy
    }, {
      title: 'alow_copy',
      content: (data.min_size || 0) + __.copy
    }, {
      title: 'delete_protect',
      content: <span className={data.params && data.params.nodelete === 'true' ? 'params-status' : 'params-status closed'}>{__[nodelete]}</span>
    }, {
      title: 'pg_protect',
      content: <span className={data.params && data.params.nopgchange === 'true' ? 'params-status' : 'params-status closed'}>{__[pgProtect]}</span>
    }, {
      title: 'copy_protect',
      content: <span className={data.params && data.params.nosizechange === 'true' ? 'params-status' : 'params-status closed'}>{__[copyProtect]}</span>
    }, {
      title: 'check',
      content: <span className={data.params && data.params.noscrub === 'true' ? 'params-status closed' : 'params-status'}>{__[check]}</span>
    }, {
      title: 'depth_check',
      content: <span className={data.params && data.params['nodeep-scrub'] === 'true' ? 'params-status closed' : 'params-status'}>{__[depthCheck]}</span>
    }];
    return properties;
  }

  getRelatedPoolProperties(data, isDatePool) {
    let relatedPool = data.params;

    const properties = [{
      title: 'cold_pool',
      content: isDatePool ? data.tiername_of : <Link to={`/pool/${data.tiername_of}`}>{data.tiername_of}</Link>
    }, {
      title: 'hot_pool',
      content: isDatePool ? <Link to={`/pool/${relatedPool.pool}`}>{relatedPool.pool}</Link> : data.pool_name
    }, {
      title: 'raise_threshold',
      content: `${relatedPool.min_read_recency_for_promote} / ${relatedPool.min_write_recency_for_promote}`
    }, {
      title: 'hit_set_count',
      content: relatedPool.hit_set_count
    }, {
      title: 'hit_set_period',
      content: `${relatedPool.hit_set_period} ${__.hour}`
    }, {
      title: 'cache_target_dirty_ratio',
      content: relatedPool.cache_target_dirty_ratio
    }, {
      title: 'cache_target_dirty_high_ratio',
      content: relatedPool.cache_target_dirty_high_ratio
    }, {
      title: 'cache_target_full_ratio',
      content: relatedPool.cache_target_full_ratio
    }];
    return properties;
  }

  refresh() {
    this.loadingTable();
    this.getList(this.state.page);
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
    return (
      <div className="garen-module-pool">
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