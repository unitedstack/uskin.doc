import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdMain from './md/main.md';
import mdSize from './md/size.md';
import mdFloat from './md/float.md';
import mdDisabled from './md/disabled.md';

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
  property: 'min',
  explain: '设置最小值',
  type: 'Number',
  defaultValue: '-Infinity',
  id: '1',
}, {
  property: 'max',
  explain: '设置最大值',
  type: 'Number',
  defaultValue: '+Infinity',
  id: '2',
}, {
  property: 'value',
  explain: '设置初始值',
  type: 'Number',
  defaultValue: 0,
  id: '3',
}, {
  property: 'step',
  explain: '设置输入字段的合法数字间隔',
  type: 'Number',
  defaultValue: 1,
  id: '4',
}, {
  property: 'onChange',
  explain: '当input-number的value有修改时返回value',
  type: 'Function',
  defaultValue: '',
  id: '5',
}, {
  property: 'disabled',
  explain: '设置input-number是否该disabled',
  type: 'Boolean',
  defaultValue: 'false',
  id: '6',
}, {
  property: 'width',
  explain: '设置Input-number的总宽',
  type: 'Number',
  defaultValue: '',
  id: '7',
}];

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    return (
      <div className="base-input-number-wrapper">
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
              demo={config.data.base.demo}
              description={config.data.base.description}
              code={mdMain}
            />
            <Base
              demo={config.data.size.demo}
              description={config.data.size.description}
              code={mdSize}
            />
            <Base
              demo={config.data.disabled.demo}
              description={config.data.disabled.description}
              code={mdDisabled}
            />
            <Base
              demo={config.data.float.demo}
              description={config.data.float.description}
              code={mdFloat}
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
