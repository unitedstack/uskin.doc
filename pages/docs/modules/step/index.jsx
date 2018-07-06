import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdBase from './base.md';
import mdConsecutive from './consecutive.md';
import mdWidth from './width.md';
import mdDisabled from './disabled.md';

const column = [{
  title: '属性',
  width: '150px',
  key: 'property',
  dataIndex: 'property',
}, {
  title: '类型',
  width: '160px',
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
  property: 'items',
  explain: '设置步骤条的数目，和每个步骤条的文案，以及当前进行到了哪一步',
  type: 'Array',
  defaultValue: '-',
  id: '1',
}, {
  property: 'consecutive',
  explain: '设置是否当前步骤之前的步骤均标记为完成',
  type: 'Boolean',
  defaultValue: 'false',
  id: '2',
}, {
  property: 'width',
  explain: '步骤条的总体宽度',
  type: 'Number',
  defaultValue: '570',
  id: '3',
}, {
  property: 'disabled',
  explain: '禁用步骤条，不可点击，仅做展示用',
  type: 'Boolean',
  defaultValue: 'false',
  id: '4',
}, {
  property: 'onClick',
  explain: '点击某一步时的回调函数',
  type: 'Function(event, item)',
  defaultValue: 'noop',
  id: '5',
}];

const itemData = [{
  property: 'name',
  explain: '步骤的文案',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'default',
  explain: '当前进行到的步骤',
  type: 'Boolean',
  defaultValue: '-',
  id: '2',
}];


class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    return (
      <div className="intro-step-wrapper">
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
              code={mdBase}
            />
            <Base
              demo={config.data.consecutive.demo}
              description={config.data.consecutive.description}
              code={mdConsecutive}
            />
            <Base
              demo={config.data.width.demo}
              description={config.data.width.description}
              code={mdWidth}
            />
            <Base
              demo={config.data.disabled.demo}
              description={config.data.disabled.description}
              code={mdDisabled}
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
          <div className="content-title">items</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={itemData}
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
