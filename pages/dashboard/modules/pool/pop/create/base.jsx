import React from 'react';

import {Button, Input, Icon, Form, Select} from 'antd';
import  __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from 'client/applications/dashboard/utils/error_message';
const FormItem = Form.Item;
const Option = Select.Option;

import {Subs} from 'ufec';
const Alert = Subs.Alert;
const TreeSelect = Subs.TreeSelect;
const MultistageTabs = Subs.MultistageTabs;

class ModalBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tabVisable: false,
      objectpoolTabs: [],
      error: '',
      showError: false
    };
    this.ids = [];
    this.rack = [];
    this.host = [];

    ['onConfirm', 'onCancel', 'selectChange', 'clickButton', 'clickDomain', 'onTreeSelect'].forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      currentObjectKey: 'sub_copy',
      currentKey: 'block_pool',
      btnValue: '3',
      // ecCodeValue: '2+1',
      domainValue: __.server,
    });
    request.getOsdTreeList().then(res => {
      this.getData(res);
      this.setState({
        treeData: res
      });
    });
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

  onTreeSelect(field, state) {
    this.props.form.setFieldsValue({
      'treeName': state.value
    });
  }

  onCancel() {
    this.props.onAfterClose();
  }

  getIds(treeData, rack, host, value, hasOsd) {
    treeData.forEach(tree => {
      if (hasOsd) {
        if (tree.type === 'osd' && !tree.disabled) {
          this.ids.push(tree.id);
        } else {
          this[tree.type] && this[tree.type].indexOf(tree.name) === -1 && this[tree.type].push(tree.name);
          tree.children && this.getIds(tree.children, rack, host, value, true);
        }
      } else if (tree.name === value) {
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

  onConfirm(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loading: true});
        let role = values.currentKey === 'block_pool' ? 'block' : values.currentKey === 'cloud_pool' ? 'cloud' : values.currentKey === 'cache_pool' ? 'cache' : values.currentKey === 'iscsi_pool' ? 'iscsi' : 'data';
        let strategy = values.currentObjectKey === 'sub_copy' ? parseInt(values.btnValue, 10) : values.ecCodeValue;
        let domainValue = values.domainValue === __.rack ? 'rack' : values.domainValue === __.server ? 'host' : 'datacenter';
        let value = values.treeName;
        this.ids = [];
        this.rack = [];
        this.host = [];
        value && value.forEach(v => {
          this.getIds(this.state.treeData, null, null, v);
        });

        let poolData ={
          'name': values.userName,
          'role': role,
          'strategy': strategy,
          'acrossType': domainValue,
          'osds': this.ids
        };

        let length;
        if (values.currentObjectKey === 'sub_copy') {
          length = parseInt(values.btnValue, 10);
        } else {
          let ecCode = values.ecCodeValue.split('+');
          length = Number(ecCode[0]) + Number(ecCode[1]);
        }

        if (this.ids.length < length) {
          this.setState({
            showError: true,
            loading: false,
            error: 'osd_tip'
          });
        } else if (this[domainValue].length < length) {
          this.setState({
            showError: true,
            loading: false,
            error: __.domian_tip.replace('{0}', length).replace('{1}', __[domainValue])
          });
        } else {
          this.setState({
            showError: false
          });
          request.createPool(poolData).then((res) => {
            this.onCancel();
            this.props.callback && this.props.callback();
          }).catch((err) => {
            let errorTip = getErrorMessage(err);
            this.setState({
              showError: true,
              loading: false,
              error: errorTip
            });
          });
        }
      }
    });
  }

  onChangTabs(field, state) {
    if(state.activeKey === this.state.currentKey) {
      return;
    }
    this.setState({
      currentKey: state.activeKey
    }, () => {
    });
  }

  onChangObjectPoolTabs(field, state) {
    if(state.activeKey === this.state.currentObjectKey) {
      return;
    }
    this.props.form.setFieldsValue({
      'currentObjectKey': state.activeKey
    });
  }

  clickButton(e) {
    this.props.form.setFieldsValue({
      'btnValue':  e.target.value
    });
  }

  selectChange(value) {
    this.props.form.setFieldsValue({
      'ecCodeValue':  value
    });
  }

  clickDomain(e) {
    this.props.form.setFieldsValue({
      'domainValue': e.target.value
    });
  }

  render() {
    let state = this.state;
    this.modalRef = React.createRef();

    const tabs = [{
      'name': 'common_block_pool',
      'key': 'block_pool',
      'default': true
    }, {
      'name': 'cloud_pool',
      'key': 'cloud_pool'
    }, {
      'name': 'object_pool',
      'key': 'object_pool'
    }, {
      'name': 'cache_pool',
      'key': 'cache_pool'
    }];

    if (GAREN.rbd === 'initialized') {
      tabs.push({
        'name': 'iscsi_pool',
        'key': 'iscsi_pool'
      });
    }

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const { getFieldDecorator } = this.props.form;

    let btnValue = this.props.form.getFieldValue('btnValue');
    let domainValue = this.props.form.getFieldValue('domainValue') === __.rack ? 'rack' : this.props.form.getFieldValue('domainValue') === __.server ? 'host' : 'datacenter';

    let objectpoolTabs = [];
    {this.props.form.getFieldValue('currentKey') === 'object_pool' ? objectpoolTabs = [{
      'name': 'copy',
      'key': 'sub_copy',
      'default': true,
      'content':
        <div className="pool-copy-number">
          <FormItem
            required={true}
            {...formItemLayout}>
            {getFieldDecorator('btnValue')(
              <div className="pool-copy-number-button">
                <input type="button" className={btnValue=== '1' ? 'actives' : ''} value="1" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '2' ? 'actives' : ''} value="2" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '3' ? 'actives' : ''} value="3" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '4' ? 'actives' : ''} value="4" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '5' ? 'actives' : ''} value="5" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '6' ? 'actives' : ''} value="6" onClick={this.clickButton.bind(this)}/>
              </div>
            )}
          </FormItem>
        </div>
    }, {
      'name': 'ec_code',
      'key': 'ec_code',
      'content': <div className="ec-code">
        <FormItem
          required={true}
          {...formItemLayout}>
          {getFieldDecorator('ecCodeValue')(
            <Select  onChange={this.selectChange}>
              <Option value="2+1">2+1</Option>
              <Option value="2+2">2+2</Option>
              <Option value="4+2">4+2</Option>
              <Option value="4+3">4+3</Option>
              <Option value="8+3">8+3</Option>
              <Option value="8+4">8+4</Option>
            </Select>
          )}
        </FormItem>
      </div>
    }] : objectpoolTabs = [{
      'name': 'copy',
      'key': 'sub_copy',
      'default': true,
      'content':
        <div className="pool-copy-number">
          <FormItem
            required={true}
            {...formItemLayout}>
            {getFieldDecorator('btnValue')(
              <div className="pool-copy-number-button">
                <input type="button" className={btnValue=== '1' ? 'actives' : ''} value="1" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '2' ? 'actives' : ''} value="2" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '3' ? 'actives' : ''} value="3" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '4' ? 'actives' : ''} value="4"onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '5' ? 'actives' : ''} value="5" onClick={this.clickButton.bind(this)}/>
                <input type="button" className={btnValue=== '6' ? 'actives' : ''} value="6" onClick={this.clickButton.bind(this)}/>
              </div>
            )}
          </FormItem>
        </div>
    }];}

    return(
      <Form>
        <div className="create-pool-big" ref={ this.modalRef }>
          <div className="create-pool-title"><span onClick={this.onCancel}><Icon type="left" />{__.create + __.pool}</span></div>
          <div className="create-pool-content">
            <div className="content-wrapper">
              <FormItem
                label={__.pool_name}
                required={true}
                {...formItemLayout}>
                {getFieldDecorator('userName', {
                  rules: [{
                    required: true,
                    message: __.nameMsg
                  }],
                })(
                  <Input placeholder={__.poolname_tip} required={true}/>
                )}
              </FormItem>
              <div className="pool-rool">
                <FormItem
                  label={__.pool_rool}
                  required={true}
                  {...formItemLayout}>
                  {tabs && tabs.length > 1 ? <div className="tabs">
                    <MultistageTabs
                      __={__}
                      form={this.props.form}
                      panes={tabs}
                      subpanes ={objectpoolTabs}
                      onAction={this.onChangTabs.bind(this)}
                      onSubAction={this.onChangObjectPoolTabs.bind(this)}
                      type="card"
                      subtype="card">
                    </MultistageTabs>
                  </div> : null}
                </FormItem>
                <span className="label-positoin"><strong>*</strong>{__.pool_tactics + ':'}</span>
                {state.currentObjectKey !== 'ec_code' ? <span className="label-positoin-number"><strong>*</strong>{__.copy_number + ':'}</span> : null}
              </div>
              <div className="fault_domain">
                <FormItem
                  label={__.fault_domain}
                  required={true}
                  {...formItemLayout}>
                  {getFieldDecorator('domainValue')(
                    <div className="pool-copy-number-button">
                      <input type="button" className={domainValue=== 'host' ? 'actives' : ''} value={__.server} onClick={this.clickDomain.bind(this)}/>
                      <input type="button" className={domainValue=== 'rack' ? 'actives' : ''} value={__.rack} onClick={this.clickDomain.bind(this)}/>
                      <input type="button" disabled={true} className="disabled" value={__.data_center} />
                    </div>
                  )}
                </FormItem>
              </div>
              <FormItem
                label={__.osd}
                required={true}
                {...formItemLayout}>
                <TreeSelect
                  required={true}
                  __={__}
                  form={this.props.form}
                  decorator={{
                    id: 'treeName',
                    rules: [{
                      required: true,
                      message: __.volumeMsg
                    }],
                    onChange: this.onTreeSelect
                  }}
                  treeData={state.treeData} />
              </FormItem>
              {state.showError ? <div className="error-tip"><Alert showIcon message={state.error} __={__} tip_type="error"/></div> : null}
              <Button className="cancel-button" type="dashed" ref="btn" onClick={this.onCancel}>{__.cancel}</Button>
              <Button className="create-button" type="primary" loading={state.loading} onClick={this.onConfirm}>{__.create}</Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create()(ModalBase);
