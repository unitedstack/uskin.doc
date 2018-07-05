import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdDefault from './default.md';
import mdType from './type.md';
import mdHref from './href.md';
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
  property: 'type',
  explain: '设置Tab的大小，可用值"sm"或者default',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'items',
  explain: '设置文本内容',
  type: 'Array',
  defaultValue: '-',
  id: '2',
}];

const itemData = [{
  property: 'name',
  explain: 'Tab 名称',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'key',
  explain: 'item 的唯一标识',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'default',
  explain: '设置初始化时当前Tab是否选中',
  type: 'Boolean',
  defaultValue: 'false',
  id: '3',
}, {
  property: 'href',
  explain: '设置Tab链接的地址',
  type: 'String',
  defaultValue: '-',
  id: '4',
}, {
  property: 'onClick',
  explain: 'click事件的Handler',
  type: 'Function',
  defaultValue: '-',
  id: '5',
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
        case 'disabled':
          return mdDisabled;
        case 'href':
          return mdHref;
        default:
          return mdDefault;
      }
    }

    return (
      <div className="intro-tab-wrapper">
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
        <div className="project-wrapper">
          <div className="content-title">Tab.Item</div>
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
