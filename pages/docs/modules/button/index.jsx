import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdType from './md/type.md';
import mdSize from './md/size.md';
import mdState from './md/state.md';
import mdLoading from './md/loading.md';

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
  property: 'value',
  explain: 'Button的文字',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'type',
  explain: '设置按钮类型',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'disabled',
  explain: '设置按钮是否有效',
  type: 'Boolean',
  defaultValue: 'false',
  id: '3',
}, {
  property: 'initial',
  explain: 'Button的宽度适应于文字长度',
  type: 'Boolean',
  defaultValue: 'false',
  id: '4',
}, {
  property: 'selected',
  explain: 'Button是否要selected状态',
  type: 'Boolean',
  defaultValue: 'false',
  id: '5',
}, {
  property: 'disabled',
  explain: 'Button是否要disabled状态',
  type: 'Boolean',
  defaultValue: 'false',
  id: '6',
}, {
  property: 'loading',
  explain: 'Button loading状态',
  type: 'Boolean',
  defaultValue: 'false',
  id: '7',
}, {
  property: 'tag',
  explain: '默认值为Button最后以button标签形式生成，当tag="div"时由div标签生成',
  type: 'String',
  defaultValue: '-',
  id: '8',
}, {
  property: 'onClick',
  explain: 'click事件的handler',
  type: 'Function',
  defaultValue: '-',
  id: '9',
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
              demo={config.data.type.demo}
              description={config.data.type.description}
              code={mdType}
            />
            <Base
              demo={config.data.size.demo}
              description={config.data.size.description}
              code={mdSize}
            />
            <Base
              demo={config.data.state.demo}
              description={config.data.state.description}
              code={mdState}
            />
            <Base
              demo={config.data.loading.demo}
              description={config.data.loading.description}
              code={mdLoading}
            />
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
