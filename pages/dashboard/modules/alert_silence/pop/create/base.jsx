import './style/index.less';
import React from 'react';
import { Modal, Button, Form, DatePicker, Input, Checkbox, LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import {Subs} from 'ufec';
const Alert = Subs.Alert;
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const lang = GAREN.locale === 'zh-cn' ? zh_CN : en_US;

class CreateAlarmSilencePop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirming: false,
      disabled: false,
      error: false,
      errorMsg: ''
    };

    this.uuid = 1;

    ['handleAddRule', 'handleSubmit', 'onCancel'].forEach(handler => {
      this[handler] = this[handler].bind(this);
    });
  }

  onCancel() {
    this.props.onAfterClose();
  }

  handleAddRule() {
    const { form } = this.props;
    const rules = form.getFieldValue('rules');
    const nextRules = rules.concat(this.uuid);
    this.uuid++;

    form.setFieldsValue({
      rules: nextRules
    });
  }

  handleRemoveRule(key) {
    const { form } = this.props;
    const rules = form.getFieldValue('rules');

    form.setFieldsValue({
      rules: rules.filter(k => {
        return k !== key;
      })
    });
  }

  handleSubmit() {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(!err) {
        const submitObj = {
          startsAt: values.timeSetting[0].format(),
          endsAt: values.timeSetting[1].format(),
          createdBy: values.creator,
          comment: values.note,
          matchers: values.rules.map((rule, index)=> {
            return {
              name: values.rulesName[index],
              value: values.rulesValue[index],
              isRegex: values.rulesIsReg[index]
            };
          })
        };

        this.setState({
          confirming: true,
          disabled: true,
          error: false,
          errorMsg: ''
        });

        request.createAlertSilence(submitObj).then(res => {
          this.onCancel();
          this.props.callback();
        }).catch(err => {
          this.setState({
            confirming: false,
            disabled: false,
            error: true,
            errorMsg: getErrorMessage(err)
          });
        });

      }
    });
  }

  render() {
    const { __ } = this.props;
    const state = this.state;

    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };


    getFieldDecorator('rules', { initialValue: [0]});
    const rules = getFieldValue('rules');
    const ruleItems = rules.map((r, index) => {
      return (
        <div key={r}>
          <FormItem>
            {
              getFieldDecorator(`rulesName[${r}]`, {
                rules: [{
                  required: true,
                  message: __.pls_input_rule_name
                }]
              })(
                <Input placeholder={__.name} />
              )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator(`rulesValue[${r}]`, {
                rules: [{
                  required: true,
                  message: __.pls_input_rule_value
                }]
              })(
                <Input placeholder={__.value} />
              )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator(`rulesIsReg[${r}]`, {
                valuePropName: 'checked',
                initialValue: true
              })(
                <Checkbox>{__.match_regular}</Checkbox>
              )
            }
          </FormItem>
          {
            index !== 0 ?
              <Button icon="close" type="primary" size="small"
                onClick={this.handleRemoveRule.bind(this, r)} /> : null
          }
        </div>
      );
    });

    return (
      <Modal
        title={__.create_alert_silence}
        visible={true}
        bodyStyle={{ padding: '24px 50px 24px 0' }}
        width={540}
        onCancel={this.onCancel}
        getContainer={() => {
          return document.getElementById('modal-container').lastElementChild;
        }}
        maskClosable={false}
        footer={[
          <Button key="cancel" type="dashed" onClick={this.onCancel}>{__.cancel}</Button>,
          <Button key="confirm" type={'primary'} onClick={this.handleSubmit} htmlType="button" disabled={state.disabled} loading={state.confirming}>{__.confirm}</Button>
        ]}
      >
        <LocaleProvider locale={lang}>
          <Form>
            <FormItem
              label={__.time_setting}
              {...formItemLayout}>
              {
                getFieldDecorator('timeSetting', {
                  rules: [{
                    required: true,
                    message: __.pls_select_silent_time
                  }]
                })(
                  <RangePicker
                    style={{ width: '100%' }}
                    format={'YYYY-MM-DD HH:mm'}
                    placeholder={[__.start_time, __.end_time]}
                    showTime={{ format: 'HH:mm' }} />
                )
              }
            </FormItem>
            <FormItem
              label={__.alert_entry_matching_rules}
              required={true}
              {...formItemLayout}>
              <div className="matching-rules-wrapper">
                <div>
                  <div className="matching-rules-title">
                    <div>{__.name}</div>
                    <div>{__.rule}</div>
                  </div>
                  <div className="matching-rules-input-wrapper">
                    {ruleItems}
                  </div>
                </div>
                <div className="matching-rules-add-btn-wrapper">
                  <Button icon="plus" type="primary" size="small" onClick={this.handleAddRule} />
                  <span>{__.add_alert_entry_matching_rules}</span>
                </div>
              </div>
            </FormItem>
            <FormItem
              label={__.creator}
              {...formItemLayout}>
              {
                getFieldDecorator('creator', {
                  rules: [{
                    required: true,
                    message: __.pls_input_creator
                  }]
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
              label={__.note}
              {...formItemLayout}>
              {
                getFieldDecorator('note', {})(
                  <Input.TextArea rows={4} />
                )
              }
            </FormItem>
            <Alert __={__} message={state.errorMsg} hide={!state.error} tip_type="error" />
          </Form>
        </LocaleProvider>
      </Modal>
    );
  }
}


const WrappedCreateAlarmSilencePop = Form.create()(CreateAlarmSilencePop);

export default WrappedCreateAlarmSilencePop;

