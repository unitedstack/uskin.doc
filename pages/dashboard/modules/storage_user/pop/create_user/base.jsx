import React from 'react';

import {Button, Icon, Tabs, Input, notification, Form} from 'antd';
import  __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from 'client/applications/dashboard/utils/error_message';
import regex from '../../../../utils/regex';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

import {Subs} from 'ufec';
const Checkbox = Subs.Checkbox;
const InputNumber = Subs.InputNumber;
const Alert = Subs.Alert;

class ModalBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errorHide: true,
      refs: {},
      error: '',
      showError: false,
      system: false,
      userHide: true,
      bucketHide: true,
      optionHide: true
    };

    this.id = 0;

    ['handleSubmit', 'onCancel', 'onAction', 'onCheckOption',
      'onCheckUser', 'onCheckBucket','openNotificationWithIcon'].forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  onCheckUser(value) {
    this.setState({
      userHide: !(value.length > 0)
    });
  }

  onCheckBucket(value) {
    this.setState({
      bucketHide: !(value.length > 0)
    });
  }

  onCheckOption(value) {
    this.setState({
      optionHide: !(value.length > 0)
    });
  }

  openNotificationWithIcon(type) {
    notification[type]({
      message: __.create_keypair_tip
    });
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loading: true});
        let createUserData = {
          'uid': values.userName,
          'display-name': values.userName
        };
        let checkUserEnabled = values.user_data && values.user_data.length > 0 ? true : false;
        let checkBucketEnabled = values.bucket_data && values.bucket_data.length > 0 ? true : false;
        let checkSystemEnabled = values.check_system && values.check_system.length > 0 ? true : false;

        createUserData['email'] = values.email;
        createUserData['system'] = checkSystemEnabled;
        createUserData['max-buckets'] = parseInt(values.bucket_qutoa, 10) || 1000;
        createUserData['access-key'] = values.accessKey;
        createUserData['secret-key'] = values.securityKey;
        request.createUser(createUserData).then((res) => {
          this.openNotificationWithIcon('success');
          let userQuotaData = {
            'uid': values.userName,
            'max-objects': parseInt(values.objects_qutoa, 10) || undefined,
            'max-size-kb': parseInt(values.capacity_qutoa, 10) * 1024 * 1024 || undefined,
            'enabled': checkUserEnabled
          };

          let bucketQuotaData = {
            'uid': values.userName,
            'max-objects': parseInt(values.objects_entres, 10) || undefined,
            'max-size-kb': parseInt(values.bucket_capacity, 10) * 1024 * 1024 || undefined,
            'enabled': checkBucketEnabled
          };

          if(checkUserEnabled) {
            request.createUserQuota(userQuotaData).then((res) => {
              if(checkBucketEnabled) {
                request.createBucketQuota(bucketQuotaData).then((res) => {
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
              } else {
                this.onCancel();
                this.props.callback && this.props.callback();
              }
            }).catch((err) => {
              let errorTip = getErrorMessage(err);
              this.setState({
                showError: true,
                loading: false,
                error: errorTip
              });
            });
          } else {
            if(checkBucketEnabled) {
              request.createBucketQuota(bucketQuotaData).then((res) => {
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
            } else {
              this.onCancel();
              this.props.callback && this.props.callback();
            }
          }
          this.props.callback && this.props.callback();
        });
        this.refs.btn.setState({
          disabled: true
        });
      }
    });
  }

  render() {
    let state = this.state;
    this.modalRef = React.createRef();

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const { getFieldDecorator } = this.props.form;

    let userData = [{
      'label': 'enable_userQuota',
      'value': 'userQuota'
    }];

    let bucketData = [{
      'label': 'enable_defaultQuota',
      'value': 'bucketQuota'
    }];

    let systemData = [{
      'label': 'system_user',
      'value': 'system_user'
    }];

    let optionData = [{
      'label': 'option',
      'value': 'option'
    }];

    let userHide = state.userHide === true ?  ' hide' : '';
    let bucketHide = state.bucketHide === true ?  ' hide' : '';
    let optionHide = state.optionHide === true ? ' hide' : '';

    return (
      <Form>
        <div className="big-main-wrapper big-pop" ref={ this.modalRef }>
          <div className="big-pop-title"><span onClick={this.onCancel}><Icon type="left" />{__.create + __.storage + __.user}</span></div>
          <div className="big-pop-content">
            <div className="content-wrapper">
              <FormItem
                label={__.userName}
                required={true}
                {...formItemLayout}>
                {getFieldDecorator('userName', {
                  rules: [{
                    required: true,
                    pattern: regex.nameReg,
                    message: __.nameMsg
                  }],
                })(
                  <Input onChange={this.displayName} placeholder={__.username_tip} required={true}/>
                )}
              </FormItem>
              <FormItem
                label={__.email}
                {...formItemLayout}>
                {getFieldDecorator('email', {
                  rules: [{
                    pattern: regex.emailReg,
                    message: __.email_tip
                  }],
                })(
                  <Input placeholder={__.email_tip} required={true}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={__.bucket_qutoa}>
                <InputNumber __={__}
                  addonAfter="buckets_entres"
                  form={this.props.form}
                  decorator={{
                    id: 'bucket_qutoa'
                  }}/>
              </FormItem>

              <div className="check">
                <FormItem
                  {...formItemLayout}
                  label={__.user_data}>
                  <Checkbox
                    label="user_data"
                    data={userData}
                    form={this.props.form}
                    decorator={{
                      id: 'user_data',
                      onChange: this.onCheckUser
                    }}
                    __={__}/>
                </FormItem>
              </div>
              <div className={'user_data' + userHide} >
                <FormItem
                  {...formItemLayout}
                  className="qutoa"
                  label={__.capacity_qutoa}>
                  <InputNumber
                    __={__}
                    form={this.props.form}
                    decorator={{
                      id: 'capacity_qutoa'
                    }}
                    addonAfter="GB"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={__.objects_qutoa}>
                  <InputNumber
                    __={__}
                    form={this.props.form}
                    decorator={{
                      id: 'objects_qutoa'
                    }}
                    tipTitle="modify_quota_tip"
                    addonAfter="objects_entres"
                    min={-1}/>
                </FormItem>
              </div>

              <div className="check">
                <FormItem
                  {...formItemLayout}
                  label={__.bucket_data}>
                  <Checkbox
                    label="user_data"
                    data={bucketData}
                    __={__}
                    form={this.props.form}
                    decorator={{
                      id: 'bucket_data',
                      onChange: this.onCheckBucket
                    }}/>
                </FormItem>
              </div>
              <div className={'bucket_data' + bucketHide}>
                <FormItem
                  {...formItemLayout}
                  className="qutoa"
                  label={__.bucket_capacity}>
                  <InputNumber __={__}
                    addonAfter="GB"
                    form={this.props.form}
                    decorator={{
                      id: 'bucket_capacity'
                    }}/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={__.object_capacity}>
                  <InputNumber
                    __={__}
                    tipTitle="modify_quota_tip"
                    addonAfter={__.objects_entres}
                    min={-1}
                    form={this.props.form}
                    decorator={{
                      id: 'objects_entres'
                    }}/>
                </FormItem>
              </div>
              <div className="check">
                <FormItem
                  {...formItemLayout}
                  label={__.check_option}>
                  <Checkbox
                    label="user_data"
                    data={optionData}
                    __={__}
                    form={this.props.form}
                    decorator={{
                      id: 'check_option',
                      onChange: this.onCheckOption
                    }}/>
                </FormItem>
              </div>
              <div className={'create-keypair-option' + optionHide}>
                <div className="create-keypair">
                  <FormItem
                    {...formItemLayout}
                    label={__.keypair_type}>
                    <Tabs type="card" onAction={this.onAction}>
                      <TabPane tab={__.auto_create_key} key='1'></TabPane>
                      <TabPane tab={__.handle_create_key} key='2'>
                        <div className="keypair-table-title">
                          <span>{__.access_key}</span>
                          <span>{__.security_key}</span>
                        </div>
                        <div className="keypair-table-content">
                          <FormItem
                            labelCol= {{ span: 12 }}
                            wrapperCol= {{ span: 12 }}>
                            {getFieldDecorator('accessKey')(
                              <Input
                                placeholder={__.input + __.access_key}
                                key='1'/>
                            )}
                          </FormItem>
                          <FormItem
                            labelCol= {{ span: 12 }}
                            wrapperCol= {{ span: 12 }}>
                            {getFieldDecorator('securityKey')(
                              <Input
                                placeholder={__.input + __.security_key}
                                key='2'/>
                            )}
                          </FormItem>
                        </div>
                      </TabPane>
                    </Tabs>
                  </FormItem>
                </div>
                <div className="check check-system">
                  <FormItem
                    label={__.check_system}>
                    <Checkbox
                      label="user_data"
                      data={systemData}
                      __={__}
                      form={this.props.form}
                      decorator={{
                        id: 'check_system',
                        onChange: this.onCheckSystem
                      }}/>
                  </FormItem>
                </div>
              </div>
              {state.showError ? <div className="error-tip"><Alert showIcon message={state.error} __={__} tip_type="error"/></div> : null}
              <Button className="cancel-button" type="dashed" ref="btn" onClick={this.onCancel}>{__.cancel}</Button>
              <Button className="create-button" type="primary" loading={state.loading} onClick={this.handleSubmit}>{__.create}</Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create()(ModalBase);
