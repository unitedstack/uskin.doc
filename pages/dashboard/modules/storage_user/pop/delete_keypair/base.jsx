import React from 'react';

import { Button, Modal, Form} from 'antd';
const FormItem = Form.Item;

import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from 'client/applications/dashboard/utils/error_message';

import {Subs} from 'ufec';
const Alert = Subs.Alert;
const Checkbox = Subs.Checkbox;

class DeleteKeypair extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      visible: true,
      error: '',
      showError: false,
      loading: false,
      keypairs: []
    };

    ['onConfirm', 'onCancel', 'onAction'].forEach(m => {
      this[m] = this[m].bind(this);
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let keypairs = nextProps.obj && nextProps.obj.keys;
    keypairs.map((item, index) => {
      item.id = index;
    });
    return {
      keypairs: keypairs
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      checkedData: []
    });
  }

  onConfirm() {
    this.setState({
      loading: true
    });
    let props = this.props;
    let data = {
      'uid': props.obj.id,
      'access-key': this.props.form.getFieldValue('checkedData'),
      'email': props.obj.email
    };
    request.deleteKey(data).then((res) => {
      this.setState({
        visible: false
      }, () => {
        setTimeout(this.props.onAfterClose, 300);
      });
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

  onCancel() {
    this.setState({
      visible: false
    }, () => {
      setTimeout(this.props.onAfterClose, 300);
    });
  }

  onAction(value) {
    this.props.form.setFieldsValue({
      checkedData: value
    });
  }

  render() {
    let state = this.state;
    this.modalRef = React.createRef();
    let keypairData =[];
    this.state.keypairs.map((k, index) => {
      keypairData.push({
        'label': k.access_key,
        'value': k.access_key
      });
    });

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };

    let showKeypairs = this.state.keypairs && this.state.keypairs.length > 0;

    return (
      <Form>
        <Modal ref={ this.modalRef }
          title={__.delete + __.keypair}
          visible={state.visible}
          width={540}
          maskClosable={false}
          getContainer={() => document.getElementById('modal-container')}
          onCancel={this.onCancel}
          footer={[
            <Button key="cancel" type="dashed" onClick={this.onCancel}>{__.cancel}</Button>,
            <Button key="confirm" type="danger" loading={state.loading} onClick={this.onConfirm}>{__.delete}</Button>
          ]}>
          {showKeypairs ? <div className="delete-keypair">
            <Alert showIcon message={__.delte_keypair_tip} __={__} tip_type="error"/>
            <div className="keypair">
              <div className="keypair-table-title">
                <span>{__.access_key}</span>
                <span>{__.security_key}</span>
              </div>
              <div className="keypair-table-content">
                <FormItem
                  {...formItemLayout}>
                  <Checkbox
                    __={__}
                    data={keypairData}
                    form={this.props.form}
                    decorator={{
                      id: 'checkedData',
                      onChange: this.onAction
                    }}/>
                </FormItem>
                <div className="keypair-table-secret">
                  {this.state.keypairs && this.state.keypairs.map((k, index) => {
                    return <div key={index} className="keypair-secret">{k.secret_key && k.secret_key.length > 24 ? k.secret_key.slice(0,24) : k.secret_key}</div>;
                  })}
                </div>
              </div>
            </div>
          </div> : __.no_keypair}
          {state.showError ? <div className="delete-keypair-tip"><Alert showIcon message={state.error} __={__} tip_type="error"/></div> : null}
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(DeleteKeypair);
