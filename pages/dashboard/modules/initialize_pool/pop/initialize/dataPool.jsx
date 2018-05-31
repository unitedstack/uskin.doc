import React from 'react';
import __ from 'client/locale/dashboard.lang.json';

import { Alert, Form, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import {Subs} from 'ufec';
const TreeSelect = Subs.TreeSelect;
const Input = Subs.Input;
const AlertSub = Subs.Alert;

class DataPool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [],
      domain_type: 'host',
      redundancy: 'copy',
      copy: '1',
      ec_code: '2+1',
      pool_name: '',
      pool_disk: [],
      osdValue: [],
      error: false,
      message: null
    };
  }

  onClick(ele, key) {
    this.props.form.setFieldsValue({
      [ele]: key
    });
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      domain_type: 'host',
      redundancy: 'copy',
      copy: '1',
      ec_code: '2+1',
      pool_name: '',
      pool_disk: []
    });
  }

  selectChange(value) {
    this.props.form.setFieldsValue({
      ec_code: value
    });
  }

  renderType(panes, ele) {
    return <div className="form-wrapper">
      {panes.map((pane, index) =>
        <div className={pane.disabled ? 'pane-wrapper disabled' : (this.props.form.getFieldValue(ele) === pane.key ? 'pane-wrapper checked ' + ele : 'pane-wrapper ' + ele)}
          key={pane.key}
          onClick={pane.disabled ? null : this.onClick.bind(this, ele, pane.key)}>
          {__[pane.title] || pane.title}
        </div>
      )}
    </div>;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      treeData: nextProps.treeData,
      osdValue: nextProps.poolData.osdValue,
      error: nextProps.error,
      message: nextProps.message
    };
  }

  render() {
    const state = this.state;
    const panes = [{
      title: 'host',
      key: 'host'
    }, {
      title: 'rack',
      key: 'rack'
    }, {
      title: 'data_center',
      key: 'data_center',
      disabled: true
    }];

    const copyNums = [{
      title: '1',
      key: '1'
    }, {
      title: '2',
      key: '2'
    }, {
      title: '3',
      key: '3'
    }, {
      title: '4',
      key: '4'
    }, {
      title: '5',
      key: '5'
    }, {
      title: '6',
      key: '6'
    }];

    const redundancy = [{
      title: 'copy',
      key: 'copy'
    }, {
      title: 'ec_code',
      key: 'ec_code'
    }];

    const { getFieldDecorator } = this.props.form;

    return <div className="metadata-wrapper">
      <Alert type="info" description={__.data_pool_tip} />
      <Input
        className="pool-wrapper" type="input"
        __={__} label={__.pool_name}
        placeholder={__.pls_pool_name}
        form={this.props.form}
        decorator={{
          id: 'pool_name',
          rules: [{
            required: true,
            message: __.is_required.replace('{0}', __.pool_name)
          }]
        }}/>
      <FormItem
        label={__.redundancy}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}>
        {getFieldDecorator('redundancy')(this.renderType(redundancy, 'redundancy'))}
      </FormItem>
      <div className={this.props.form.getFieldValue('redundancy') === 'copy' ? '' : 'hide'}>
        <FormItem
          label={__.copy_number}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}>
          {getFieldDecorator('copy')(this.renderType(copyNums, 'copy'))}
        </FormItem>
      </div>
      <div className={this.props.form.getFieldValue('redundancy') === 'ec_code' ? 'ec-code' : 'hide'}>
        <FormItem
          label="code"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}>
          {getFieldDecorator('ec_code')(
            <Select>
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
      <FormItem
        label={__.domain_type}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}>
        {getFieldDecorator('domain_type')(this.renderType(panes, 'domain_type'))}
      </FormItem>
      <div className="tree-wrapper">
        <TreeSelect
          form={this.props.form}
          __={__} label={__.disk}
          treeData={state.treeData}
          decorator={{
            id: 'pool_disk',
            rules: [{
              required: true,
              message: __.is_required.replace('{0}', __.disk)
            }]
          }}/>
      </div>
      <AlertSub __={__} message={state.message} hide={!state.error} tip_type="error" />
    </div>;
  }
}

export default DataPool;