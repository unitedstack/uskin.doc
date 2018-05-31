import React from 'react';

import {Button, Input, Icon, Form, Select} from 'antd';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from 'client/applications/dashboard/utils/error_message';
const FormItem = Form.Item;
const Option = Select.Option;

import {Subs} from 'ufec';
const Text = Subs.Text;
const Switch = Subs.Switch;
const Alert = Subs.Alert;
const Checkbox = Subs.Checkbox;
const InputNumber = Subs.InputNumber;

class ModalBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      showError: false,
      optionShow: false
    };

    ['onConfirm', 'onCancel', 'onAction', 'displayName',
      'switchDelete', 'depthCheck', 'pgProtect', 'onCheck', 'copyProtect',
      'clickButton', 'onCheckOption', 'minCopyNumber', 'changeDataMinimum',
      'changeDataMaxnum', 'changeDeepnum', 'selectChange'].forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      pool_name: this.props.obj.pool_name,
      pool_rool: this.props.obj.application_metadata,
      fault_domain: this.props.obj.crush_failure_domain,
      switchDelete: this.props.obj.params.nodelete === 'true',
      pgProtect: this.props.obj.params.nopgchange === 'true',
      depthCheck: this.props.obj.params['nodeep-scrub'] === 'true',
      check: this.props.obj.params.noscrub === 'true',
      dataMinimum: this.props.obj.params.scrub_min_interval,
      dataMaxnum: this.props.obj.params.scrub_max_interval,
      deepnum: this.props.obj.params.deep_scrub_interval
    });
    if(typeof(this.props.obj.strategy)=== 'number') {
      this.props.form.setFieldsValue({
        btnValue: this.props.obj.size,
        copy_protect: this.props.obj.params.nosizechange === 'true',
        min_copy_number: this.props.obj.min_size
      });
    } else {
      this.props.form.setFieldsValue({
        ec_code: this.props.obj.erasure_code_profile_detail && this.props.obj.erasure_code_profile_detail.k && this.props.obj.erasure_code_profile_detail.m && this.props.obj.erasure_code_profile_detail.k + '+' + this.props.obj.erasure_code_profile_detail.m,
      });
    }
  }

  onAction(field, state) {
    let that = this;
    setTimeout(function() {
      that.props.onAction(field, state, that.state.refs);
    }, 0);
  }

  onCancel() {
    this.props.onAfterClose();
  }

  onConfirm(e) {
    this.setState({loading: true});
    let props = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let modifyOsdData = {};
        modifyOsdData['name'] = values.pool_name;
        modifyOsdData['nodelete'] = values.switchDelete.toString();
        modifyOsdData['nosizechange'] = values.copy_protect.toString();
        modifyOsdData['nopgchange'] = values.pgProtect.toString();
        modifyOsdData['nodeep-scrub'] = values.depthCheck.toString();
        modifyOsdData['noscrub'] = values.check.toString();
        modifyOsdData['strategy'] =  props.obj.erasure_code_profile_detail && props.obj.erasure_code_profile_detail.k ? values.ec_code : values.btnValue;
        if(values.dataMaxnum !== undefined) {
          modifyOsdData['scrub_max_interval'] = values.dataMaxnum === '' ? 0 : parseInt(values.dataMaxnum, 10);
        }
        if(values.dataMinimum !== undefined) {
          modifyOsdData['scrub_min_interval'] = values.dataMinimum === '' ? 0 : parseInt(values.dataMinimum, 10);
        }
        if(values.deepnum !== undefined) {
          modifyOsdData['deep_scrub_interval'] = values.deepnum === '' ? 0 : parseInt(values.deepnum, 10);
        }
        if(values.copy_protect === false && !values.ec_code) {
          modifyOsdData['min_size'] = parseInt(values.min_copy_number, 10);
        }

        request.modifyPool(modifyOsdData, this.props.obj.pool_name).then(res => {
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
    });
  }

  displayName(event) {
    const nameValue = event.target.value;
    this.props.form.setFieldsValue({
      pool_name: nameValue
    });
  }

  selectChange(value) {
    this.props.form.setFieldsValue({
      ec_code: value
    });
  }

  clickButton(e) {
    const btnValue = e.target.value;
    const minCopyNumber = this.props.form.getFieldValue('min_copy_number');
    this.props.form.setFieldsValue({
      btnValue: parseInt(btnValue, 10)
    });
    if(minCopyNumber > btnValue) {
      this.props.form.setFieldsValue({
        min_copy_number: parseInt(btnValue, 10)
      });
    }
  }

  switchDelete(value) {
    this.props.form.setFieldsValue({
      switchDelete: value
    });
  }

  copyProtect(value) {
    const switchProtect = value.toString();
    this.setState({
      copyProtect: switchProtect
    });
    if(switchProtect === 'true') {
      this.props.form.setFieldsValue({
        btnValue: this.props.obj.size,
        min_copy_number: this.props.obj.min_size
      });
    }
  }

  pgProtect(value) {
    this.props.form.setFieldsValue({
      pgProtect: value
    });
  }

  depthCheck(value) {
    this.props.form.setFieldsValue({
      depthCheck: value
    });
  }

  onCheck(value) {
    this.props.form.setFieldsValue({
      check: value
    });
  }

  onCheckOption(value) {
    this.props.form.setFieldsValue({
      checkOption: value
    });
    this.setState({
      optionShow: !!value.length
    });
  }

  minCopyNumber(value) {
    this.props.form.setFieldsValue({
      min_copy_number: value
    });
  }

  changeDataMinimum(value) {
    this.props.form.setFieldsValue({
      dataMinimum: value
    });
  }

  changeDataMaxnum(value) {
    this.props.form.setFieldsValue({
      dataMaxnum: value
    });
  }

  changeDeepnum(value) {
    this.props.form.setFieldsValue({
      deepnum: value
    });
  }

  render() {
    let state = this.state,
      props = this.props;
    this.modalRef = React.createRef();

    const optionData = [{
      'label': 'option',
      'value': 'option'
    }];

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const { getFieldDecorator } = this.props.form;

    let optionShow = this.state.optionShow;
    let poolName, poolRole, strategy, btnValue, domainValue, btnClass, copyProtect, switchDelete, depthCheck, check, pgProtect;

    copyProtect = this.props.form.getFieldValue('copy_protect');
    btnClass = copyProtect === true ? 'modify-input' : '';
    poolRole = this.props.obj.application_metadata;
    btnValue = this.props.form.getFieldValue('btnValue');
    switchDelete = this.props.form.getFieldValue('switchDelete');
    depthCheck = this.props.form.getFieldValue('depthCheck');
    check = this.props.form.getFieldValue('check');
    pgProtect = this.props.form.getFieldValue('pgProtect');
    strategy = props.obj.erasure_code_profile_detail && props.obj.erasure_code_profile_detail.k && props.obj.erasure_code_profile_detail.m ? __.ec_code : __.copy;
    domainValue = this.props.form.getFieldValue('fault_domain') === 'rack' ? __.rack : this.props.form.getFieldValue('fault_domain') === 'host' ? __.server : __.data_center;

    if(poolRole && poolRole.rgw) {
      if(poolRole.rgw.type === 'data') {
        poolName = __.object_pool;
      } else if(poolRole.rgw.type === 'metadata') {
        poolName = __.meta_pool;
      }
    } else if(poolRole && poolRole.rbd) {
      if(poolRole.rbd.type === 'cloud') {
        poolName = __.cloud_pool;
      } else if(poolRole.rbd.type === 'block') {
        poolName = __.block_pool;
      } else if(poolRole.rbd.type === 'iscsi') {
        poolName = __.iscsi_pool;
      }
    } else if(poolRole && poolRole.custom) {
      if(poolRole.custom.type === 'cache') {
        poolName = __.cache_pool;
      }
    }

    return(
      <Form>
        <div className="modify-pool-big" ref={ this.modalRef }>
          <div className="modify-pool-title"><span onClick={this.onCancel}><Icon type="left" />{__.modify + __.pool}</span></div>
          <div className="modify-pool-content">
            <div className="content-wrapper">
              <FormItem
                label={__.pool_name}
                {...formItemLayout}>
                {getFieldDecorator('pool_name')(
                  <Input onChange={this.displayName} required={true}/>
                )}
              </FormItem>
              <FormItem
                label={__.pool_rool}
                {...formItemLayout}>
                {getFieldDecorator('pool_rool')(
                  <Text info={poolName} __={__}/>
                )}
              </FormItem>
              <FormItem
                label={__.redundancy}
                {...formItemLayout}>
                {getFieldDecorator('redundancy')(
                  <Text info={strategy} __={__}/>
                )}
              </FormItem>
              {strategy === __.copy ? <div className="pool-copy-number">
                <div className="edit-status-line-part">
                  <FormItem
                    label={__.copy_protect}
                    {...formItemLayout}>
                    <Switch
                      __={__}
                      checkedChildren={__.on}
                      unCheckedChildren={__.off}
                      defaultChecked={copyProtect === true ? true : false}
                      checked={copyProtect === true ? true : false}
                      form={this.props.form}
                      decorator={{
                        id: 'copy_protect',
                        onChange: this.copyProtect
                      }}/>
                  </FormItem>
                </div>
                <FormItem
                  label={__.alow_copy}
                  {...formItemLayout}>
                  <div className="min-copy-number">
                    <InputNumber
                      form={this.props.form}
                      decorator={{
                        id: 'min_copy_number',
                        onChange: this.minCopyNumber
                      }}
                      max={btnValue}
                      disabled={copyProtect === false ? false : true}
                      __={__}
                      tipTitle={__.alow_copy_tooltip}/>
                  </div>
                </FormItem>
                <FormItem
                  label={__.copy_number}
                  {...formItemLayout}>
                  {getFieldDecorator('btnValue')(
                    <div className="pool-copy-number-button">
                      <input type="button" disabled={copyProtect === false ? false : true} className={btnValue=== 1 ? 'actives ' + btnClass : btnClass} defaultValue="1" onClick={this.clickButton.bind(this)}/>
                      <input type="button" disabled={copyProtect === false ? false : true} className={btnValue=== 2 ? 'actives ' + btnClass : btnClass} defaultValue="2" onClick={this.clickButton.bind(this)}/>
                      <input type="button" disabled={copyProtect === false ? false : true} className={btnValue=== 3 ? 'actives ' + btnClass : btnClass} defaultValue="3" onClick={this.clickButton.bind(this)}/>
                      <input type="button" disabled={copyProtect === false ? false : true} className={btnValue=== 4 ? 'actives ' + btnClass : btnClass} defaultValue="4" onClick={this.clickButton.bind(this)}/>
                      <input type="button" disabled={copyProtect === false ? false : true} className={btnValue=== 5 ? 'actives ' + btnClass : btnClass} defaultValue="5" onClick={this.clickButton.bind(this)}/>
                      <input type="button" disabled={copyProtect === false ? false : true} className={btnValue=== 6 ? 'actives ' + btnClass : btnClass} defaultValue="6" onClick={this.clickButton.bind(this)}/>
                    </div>
                  )}
                </FormItem>
              </div> : <div className="ec-code">
                <FormItem
                  required={true}
                  {...formItemLayout}>
                  {getFieldDecorator('ec_code')(
                    <Select onChange={this.selectChange}>
                      <Option value="2+1">2+1</Option>
                      <Option value="2+2">2+2</Option>
                      <Option value="4+2">4+2</Option>
                      <Option value="4+3">4+3</Option>
                      <Option value="8+3">8+3</Option>
                      <Option value="8+4">8+4</Option>
                    </Select>
                  )}
                </FormItem>
              </div>}
              <div className="fault_domain">
                <FormItem
                  label={__.fault_domain}
                  {...formItemLayout}>
                  {getFieldDecorator('fault_domain')(
                    <Text info={domainValue} __={__}/>
                  )}
                </FormItem>
              </div>
              <div className="check-option">
                <FormItem
                  {...formItemLayout}>
                  <Checkbox
                    label="option"
                    data={optionData}
                    form={this.props.form}
                    __={__}
                    decorator={{
                      id: 'checkOption',
                      onChange: this.onCheckOption
                    }}/>
                </FormItem>
              </div>
              <div className={optionShow ? 'margin-eight' : 'margin-eight hide'}>
                <FormItem
                  label={__.status_edit}
                  {...formItemLayout}>
                  <div className="edit-status">
                    <div className="edit-status-line">
                      <div className="edit-status-line-part">
                        <span className="label-name">{__.delete_status}</span>
                        <Switch
                          __={__}
                          checkedChildren={__.on}
                          unCheckedChildren={__.off}
                          defaultChecked={switchDelete === true ? true : false}
                          checked={switchDelete === true ? true : false}
                          form={this.props.form}
                          decorator={{
                            id: 'switchDelete',
                            onChange: this.switchDelete,
                            hidden: !optionShow
                          }}/>
                      </div>
                      <div className="edit-status-line-part">
                        <span className="label-name">{__.pg_protect}</span>
                        <Switch
                          __={__}
                          checkedChildren={__.on}
                          unCheckedChildren={__.off}
                          defaultChecked={pgProtect === true ? true : false}
                          checked={pgProtect === true ? true : false}
                          form={this.props.form}
                          decorator={{
                            id: 'pgProtect',
                            onChange: this.pgProtect,
                            hidden: !optionShow
                          }}/>
                      </div>
                    </div>
                    <div className="edit-status-line">
                      <div className="edit-status-line-part">
                        <span className="label-name">{__.check}</span>
                        <Switch
                          __={__}
                          checkedChildren={__.on}
                          unCheckedChildren={__.off}
                          defaultChecked={check === true ? true : false}
                          checked={check === true ? true : false}
                          form={this.props.form}
                          decorator={{
                            id: 'check',
                            onChange: this.onCheck,
                            hidden: !optionShow
                          }}/>
                      </div>
                      <div className="edit-status-line-part">
                        <span className="label-name">{__.depth_check}</span>
                        <Switch
                          __={__}
                          checkedChildren={__.on}
                          unCheckedChildren={__.off}
                          defaultChecked={depthCheck === true ? true : false}
                          checked={depthCheck === true ? true : false}
                          form={this.props.form}
                          decorator={{
                            id: 'depthCheck',
                            onChange: this.depthCheck,
                            hidden: !optionShow
                          }}/>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  label={__.data_minimum_interval}
                  {...formItemLayout}>
                  <InputNumber
                    tipTitle="data_minimum_interval_tip"
                    form={this.props.form}
                    __={__}
                    decorator={{
                      id: 'dataMinimum',
                      onChange: this.changeDataMinimum,
                      hidden: !optionShow
                    }}
                    addonAfter="day"/>
                </FormItem>
                <FormItem
                  label={__.data_max_interval}
                  {...formItemLayout}>
                  <InputNumber
                    form={this.props.form}
                    __={__}
                    tipTitle="data_max_interval_tip"
                    decorator={{
                      id: 'dataMaxnum',
                      onChange: this.changeDataMaxnum,
                      hidden: !optionShow
                    }}
                    addonAfter="day"/>
                </FormItem>
                <FormItem
                  label={__.deep_interval}
                  {...formItemLayout}>
                  <InputNumber
                    form={this.props.form}
                    __={__}
                    tipTitle="deep_interval_tip"
                    decorator={{
                      id: 'deepnum',
                      onChange: this.changeDeepnum,
                      hidden: !optionShow
                    }}
                    addonAfter="day"/>
                </FormItem>
              </div>
              {state.showError ? <div className="error-tip"><Alert showIcon message={state.error} __={__} tip_type="error"/></div> : null}
              <Button className="cancel-button" type="dashed" ref="btn" onClick={this.onCancel}>{__.cancel}</Button>
              <Button className="create-button" type="primary" loading={state.loading} onClick={this.onConfirm}>{__.modify}</Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}
export default Form.create()(ModalBase);
