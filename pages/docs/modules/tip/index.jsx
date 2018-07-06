import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.js';
import infoDemo from './info.md';
import successDemo from './success.md';
import warningDemo from './warning.md';
import dangerDemo from './danger.md';

const column = [{
  title: '属性',
  width: '150px',
  key: 'property',
  dataIndex: 'property',
}, {
  title: '类型',
  width: '100px',
  key: 'type',
  dataIndex: 'type',
}, {
  title: '默认值',
  width: '150px',
  key: 'defaultValue',
  dataIndex: 'defaultValue',
}, {
  title: '描述',
  key: 'explain',
  dataIndex: 'explain',
  render(col, item) {
    return <div style={{ wordWrap: 'break-word' }}>{item.explain}</div>;
  },
}];

const apiData = [{
  property: 'title（必填）',
  explain: '提示框标题',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'content（必填）',
  explain: '提示框内容',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'width（必填）',
  explain: '提示框宽度',
  type: 'Number',
  defaultValue: '-',
  id: '3',
}, {
  property: 'type（必填）',
  explain: '提示框类型，可选info, success, warning, danger这四种类型',
  type: 'String',
  defaultValue: '-',
  id: '4',
}, {
  property: 'showIcon',
  explain: '是否显示默认图标',
  type: 'Boolean',
  defaultValue: 'false',
  id: '5',
}, {
  property: 'icon',
  explain: '指定图标,如果指定将覆盖默认图标，icon的有效值可从uskin/css/icons.less中查到。',
  type: 'String',
  defaultValue: '-',
  id: '6',
}, {
  property: 'enableClose',
  explain: '是否显示关闭提示框按钮',
  type: 'Boolean',
  defaultValue: 'false',
  id: '7',
}, {
  property: 'isAutoHide',
  explain: '提示框是否自动隐藏',
  type: 'Boolean',
  defaultValue: 'false',
  id: '8',
}];

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    return (
      <div className="intro-button-wrapper">
        <div className="simple-description-wrapper">
          <div className="content-title">
            <span>{config.title}</span>
            <span>{config.title_cn}</span>
          </div>
          <div className="content">
            {config.simple_description}
          </div>
        </div>
        <div className="base-wrapper">
          <div className="title">基础用法</div>
          <div className="base-container-wrapper">
            <Base
              demo={config.data.info.demo}
              description={config.data.info.description}
              code={infoDemo}
            />
            <Base
              demo={config.data.success.demo}
              description={config.data.success.description}
              code={successDemo}
            />
            <Base
              demo={config.data.warning.demo}
              description={config.data.warning.description}
              code={warningDemo}
            />
            <Base
              demo={config.data.danger.demo}
              description={config.data.danger.description}
              code={dangerDemo}
            />
          </div>
        </div>
        <div className="API-wrapper">
          <div className="content-title">API</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={apiData}
              dataKey="id"
              checkbox={false}
              striped={false}
              hover={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Model;
