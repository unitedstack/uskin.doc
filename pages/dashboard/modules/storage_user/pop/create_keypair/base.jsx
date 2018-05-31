import React from 'react';

import {Button, Modal, Input, Tabs, notification, Form} from 'antd';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from 'client/applications/dashboard/utils/error_message';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

import {Subs} from 'ufec';
const Alert = Subs.Alert;

class CreateKeypair extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      error: '',
      showError: false,
      loading: false
    };

    ['onConfirm', 'onCancel', 'openNotificationWithIcon'].forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  openNotificationWithIcon(type) {
    notification[type]({
      message: __.create_keypair_tip
    });
  }

  onConfirm(e) {
    this.setState({loading: true});
    let props = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          'uid': props.obj.id
        };
        data['access-key'] = values.accessKey;
        data['secret-key'] = values.securityKey;
        request.modifyKey(data).then((res) => {
          this.openNotificationWithIcon('success');
          this.onCancel();
          this.props.callback && this.props.callback();
        }).catch((err) => {
          let errorTip = getErrorMessage(err);
          this.setState({
            loading: false,
            showError: true,
            error: errorTip
          });
        });
      }
    });
  }

  onCancel() {
    this.setState({
      visible: false
    }, () => {
      setTimeout(this.props.onAfterClose, 300);
    });
  }

  render() {
    let state = this.state;
    this.modalRef = React.createRef();
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal ref={ this.modalRef }
        title={__.create + __.keypair}
        visible={state.visible}
        width={540}
        maskClosable={false}
        getContainer={() => document.getElementById('modal-container')}
        onCancel={this.onCancel}
        footer={[
          <Button key="cancel" type="dashed" onClick={this.onCancel}>{__.cancel}</Button>,
          <Button key="confirm" type="primary" loading={state.loading} onClick={this.onConfirm}>{__.create}</Button>
        ]}>
        <Form>
          <div className="user-create-keypair">
            <FormItem
              labelCol= {{ span: 4 }}
              wrapperCol= {{ span: 20 }}
              label={__.keypair_type}>
              <Tabs type="card">
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
          {state.showError ? <div className="keypair-error-tip"><Alert showIcon message={state.error} __={__} tip_type="error"/></div> : null}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CreateKeypair);
