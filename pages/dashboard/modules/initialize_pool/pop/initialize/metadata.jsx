import React from 'react';
import __ from 'client/locale/dashboard.lang.json';

import { Alert, Form } from 'antd';

import {Subs} from 'ufec';
const TreeSelect = Subs.TreeSelect;

const FormItem = Form.Item;

class Metadata extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'host',
      osdValue: [],
      treeData: []
    };
  }

  onClick(key) {
    this.props.form.setFieldsValue({
      type: key
    });
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      type: 'host'
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      treeData: nextProps.treeData,
      osdValue: nextProps.osdValue
    };
  }

  renderType() {
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

    let type = this.props.form.getFieldValue('type');

    return <div className="form-wrapper">
      {panes.map((pane, index) =>
        <div className={pane.disabled ? 'pane-wrapper disabled' : (type === pane.key ? 'pane-wrapper checked' : 'pane-wrapper')}
          key={pane.key}
          onClick={pane.disabled ? null : this.onClick.bind(this, pane.key)}>
          {__[pane.title]}
        </div>
      )}
    </div>;
  }

  render() {
    const treeData = this.state.treeData;

    const { getFieldDecorator } = this.props.form;

    return <div className="metadata-wrapper">
      <Alert type="info" description={__.metadata_tip} />
      <FormItem
        label={__.domain_type}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}>
        {getFieldDecorator('type')(this.renderType())}
      </FormItem>
      <div className="tree-wrapper">
        <TreeSelect
          __={__}
          form={this.props.form}
          label={__.disk} treeData={treeData}
          decorator={{
            id: 'metadataOsd',
            initialValue: [],
            rules: [{
              required: true,
              message: __.is_required.replace('{0}', __.disk)
            }]
          }}/>
      </div>
    </div>;
  }
}

export default Metadata;