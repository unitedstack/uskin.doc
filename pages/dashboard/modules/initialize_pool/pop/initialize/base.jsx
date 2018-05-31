import './style/index.less';

import React from 'react';
import {Icon, Form} from 'antd';
import __ from 'client/locale/dashboard.lang.json';
import {Subs, history} from 'ufec';
const Steps = Subs.Steps;
import RenderBasic from './renderBasic';
import Metadata from './metadata';
import DataPool from './dataPool';

import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

class InitizalPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basicState: {},
      treeData: [],
      poolData: {
        poolName: '',
        osdValue: [],
        copy: '1',
        redundancy: 'copy',
        ec_code: '2 + 1',
        domain_type: 'host'
      },
      metadataPool: {
        osds: [],
        type: 'host'
      }
    };

    this.clearDomain();

    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel() {
    this.props.onAfterClose();
  }

  getIds(treeData, rack, host, value, hasOsd) {
    treeData.forEach(tree => {
      if (hasOsd) {
        if (tree.type === 'osd' && !tree.device_class && !tree.disabled) {
          this.ids.push(tree.id);
        } else {
          this[tree.type] && this[tree.type].indexOf(tree.name) === -1 && this[tree.type].push(tree.name);
          tree.children && this.getIds(tree.children, rack, host, value, true);
        }
      } else if (value.indexOf(tree.name) !== -1) {
        if (tree.type === 'osd' && !tree.disabled) {
          this.ids.push(tree.id);
          rack && this.rack.indexOf(rack) === -1 && this.rack.push(rack);
          host && this.host.indexOf(host) === -1 && this.host.push(host);
        } else {
          this[tree.type] && this[tree.type].indexOf(tree.name) === -1 && this[tree.type].push(tree.name);
          tree.children && this.getIds(tree.children, rack, host, value, true);
        }
      } else {
        if (tree.type === 'rack') {
          rack = tree.name;
        } else if (tree.type === 'host') {
          host = tree.name;
        }

        tree.children && this.getIds(tree.children, rack, host, value);
      }
    });
  }

  clearDomain() {
    this.ids = [];
    this.rack = [];
    this.host = [];
  }

  onConfirm() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const state = this.state;
        this.clearDomain();
        this.getIds(state.osdData, null, null, state.metadataPool.metadataOsd);
        let metadata = {
          osds: this.ids,
          rack: this.rack,
          host: this.host
        };
        this.clearDomain();
        this.getIds(state.treePoolData, null, null, values.pool_disk);
        let dataPool = {
          osds: this.ids,
          rack: this.rack,
          host: this.host
        };

        let data = {
          zoneGroup: state.basicState['zone-group'],
          zone: state.basicState.zone,
          metadataPoolAcrossType: state.metadataPool.type,
          metadataOsds: metadata.osds,
          dataPoolName: values.pool_name,
          dataPoolStrategy: values.redundancy === 'copy' ? Number(values.copy) : values.ec_code,
          dataPoolAcrossType: values.domain_type,
          dataOsds: dataPool.osds
        };

        if (state.basicState.backup.length > 0) {
          data['access-key'] = state.basicState['access-key'];
          data['point-address'] = state.basicState['point-address'];
          data['security-key'] = state.basicState['security-key'];
        }
        let length = 3;
        if (data.dataPoolStrategy.constructor === Number) {
          length = data.dataPoolStrategy;
        } else if (data.dataPoolStrategy.constructor === String) {
          let strategy = data.dataPoolStrategy.split('+');
          length = Number(strategy[0]) + Number(strategy[1]);
        }

        if (metadata.osds.length < 3) {
          this.setState({
            error: true,
            message: __.metadata_pool + ': ' + __.osd_tip
          });
        } else if (dataPool.osds.length < length) {
          this.setState({
            error: true,
            message: __.data_pool + ': ' + __.osd_tip
          });
        } else if (metadata[data.metadataPoolAcrossType].length < 3) {
          this.setState({
            error: true,
            message: __.metadata_pool + ': ' + __.domian_tip.replace('{0}', 3).replace('{1}', __[data.metadataPoolAcrossType])
          });
        } else if (dataPool[data.dataPoolAcrossType].length < length) {
          this.setState({
            error: true,
            message: __.data_pool + ': ' + __.domian_tip.replace('{0}', length).replace('{1}', __[data.dataPoolAcrossType])
          });
        } else {
          request.init(data).then(res => {
            this.promiseStatus('initializing');
          }).catch(error => {
            this.promiseStatus('error', error);
          });
        }
      }
    });
  }

  promiseStatus(status, errMsg) {
    this.onCancel();
    window.GAREN.rgw.status = status;
    if (status === 'error') {
      window.GAREN.rgw.message = getErrorMessage(errMsg);
    }
    const pathList = history.getPathList();
    history.push(`/${pathList[0]}`);
  }

  rackDisabeld(rack) {
    rack.disabled = rack.children.every(host => {
      let hostDisabled = host.children.every(r => r.device_class);
      host.disabled = hostDisabled;
      return hostDisabled;
    });
  }

  getData(tree) {
    tree.forEach((t, index) => {
      if (t.type === 'rack') {
        this.rackDisabeld(t);
      }
      if (t.children) {
        this.getData(tree[index].children);
      } else if (t.device_class) {
        t.disabled = true;
      }
    });
  }

  getTree(tree, poolClass, disClass, isAll) {
    tree.forEach((t, index) => {
      if (t.type === 'rack') {
        this.rackDisabeld(t);
      }
      if (isAll === 'isPool') {
        t.disabled = true;
        if (t.children) {
          this.getTree(t.children, poolClass, disClass, 'isPool');
        }
      } else if (isAll === 'isDis') {
        if (t.children) {
          this.getTree(t.children, poolClass, disClass, 'isDis');
        }
      }
      if (poolClass.indexOf(t.name) !== -1) {
        t.disabled = true;
        if (t.children) {
          this.getTree(t.children, poolClass, disClass, 'isPool');
        }
      } else if (disClass.indexOf(t.name) !== -1) {
        if (t.type === 'osd') {
          t.disabled = false;
        }
        if (t.children) {
          this.getTree(t.children, poolClass, disClass, 'isDis');
        }
      } else if (t.children) {
        this.getTree(t.children, poolClass, disClass);
      }
    });
  }

  onPrev = (current, values) => {
    if (current === 0) {
      const basicState = this.state.basicState;
      this.props.form.setFieldsValue({
        'zone-group': basicState['zone-group'],
        zone: basicState.zone,
        backup: basicState.backup
      });

      if (basicState.backup.length > 0) {
        this.props.form.setFieldsValue({
          'access-key': basicState['access-key'],
          'point-address': basicState['point-address'],
          'security-key': basicState['security-key']
        });
      }

      this.setState({
        metadataPool: values
      });
    } else {
      const metadataPool = this.state.metadataPool;
      let osdMetadata = JSON.parse(JSON.stringify(this.state.treeData));
      this.getTree(osdMetadata, values.pool_disk || [], this.state.metadataPool.metadataOsd || []);
      this.setState({
        poolData: values,
        osdData: osdMetadata
      }, () => {
        this.props.form.setFieldsValue({
          metadataOsd: metadataPool.metadataOsd,
          type: metadataPool.type
        });
      });
    }
  }

  onChangeStep = (values, current) => {
    const that = this;
    if (current === 1) {
      const metadataPool = this.state.metadataPool;
      this.props.form.setFieldsValue({
        metadataOsd: metadataPool.metadataOsd,
        type: metadataPool.type
      });
      request.getOsdTreeList().then(res => {
        that.getData(res);
        that.setState({
          basicState: values,
          treeData: res,
          osdData: JSON.parse(JSON.stringify(res)),
          treePoolData: JSON.parse(JSON.stringify(res))
        });
      }).catch(err => {
        that.setState({
          basicState: values,
          treeData: [],
          osdData: JSON.parse(JSON.stringify([])),
          treePoolData: JSON.parse(JSON.stringify([]))
        });
      });
    } else if (current === 2) {
      const poolData = this.state.poolData;
      this.props.form.setFieldsValue({
        pool_name: poolData.pool_name,
        redundancy: poolData.redundancy,
        copy: poolData.copy,
        domain_type: poolData.domain_type,
        pool_disk: poolData.pool_disk,
        ec_code: poolData.ec_code
      });

      let osdPool = JSON.parse(JSON.stringify(this.state.treeData));
      this.getTree(osdPool, values.metadataOsd, this.state.poolData.pool_disk || []);
      this.setState({
        treePoolData: osdPool,
        metadataPool: values
      });
    }
  }

  render() {
    const steps = [{
      title: __.basic_config,
      content: <RenderBasic
        form={this.props.form}
        basicState={this.state.basicState}/>
    }, {
      title: __.metadata_pool,
      content: <Metadata
        form={this.props.form}
        type={this.state.metadataPool.type}
        treeData={this.state.osdData}/>
    }, {
      title: __.data_pool,
      content: <DataPool
        form={this.props.form}
        error={this.state.error}
        message={this.state.message}
        poolData={this.state.poolData}
        treeData={this.state.treePoolData}/>
    }];

    return <Form>
      <div className="initial-pop">
        <div className="big-pop-title">
          <span onClick={this.onCancel.bind(this)}>
            <Icon type="left" />{__.init_obj_storage}
          </span>
        </div>
        <div className="step-wrapper">
          <Steps
            steps={steps}
            __={__}
            onConfirm={this.onConfirm}
            form={this.props.form}
            onPrev={this.onPrev}
            onChange={this.onChangeStep}/>
        </div>
      </div>
    </Form>;
  }
}

export default Form.create()(InitizalPop);