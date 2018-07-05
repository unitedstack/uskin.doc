import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdType from './type.md';
import mdWidth from './width.md';
import mdDisabled from './disabled.md';

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

const data = [{
  property: 'labelOn',
  explain: '在On旁边设置文本显示',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'labelOff',
  explain: '在Off旁边设置文本显示',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'disabled',
  explain: '设置Switch是否可以点击',
  type: 'Boolean',
  defaultValue: 'false',
  id: '3',
}, {
  property: 'width',
  explain: '设置Switch的宽度',
  type: 'String',
  defaultValue: '-',
  id: '4',
}, {
  property: 'checked',
  explain: '设置Switch的开关状态',
  type: 'Boolean',
  defaultValue: 'false',
  id: '5',
}, {
  property: 'onChange',
  explain: 'change事件的handler',
  type: 'Function',
  defaultValue: '-',
  id: '6',
}];

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    function getCode(key) {
      switch (key) {
        case 'type':
          return mdType;
        case 'width':
          return mdWidth;
        default:
          return mdDisabled;
      }
    }

    return (
      <div className="intro-switch-wrapper">
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
            {
              Object.keys(config.data).map(key => (<Base
                key={key}
                demo={config.data[key].demo}
                description={config.data[key].description}
                code={getCode(key)}
              />))
            }
          </div>
        </div>
        <div className="API-wrapper">
          <div className="content-title">API</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={data}
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
