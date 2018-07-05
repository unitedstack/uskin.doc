import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import dropdownone from './dropdown-one.md';
import dropdowntwo from './dropdown-two.md';

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
  property: 'title',
  explain: '设置下拉菜单项的名称',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'disabled',
  explain: '设置链接是否可以单击',
  type: 'Boolean',
  defaultValue: 'false',
  id: '2',
}, {
  property: 'danger',
  explain: '将链接设置为危险的“true”以得到红色警告背景色。',
  type: 'Boolean',
  defaultValue: 'false',
  id: '3',
}, {
  property: 'items',
  explain: '在特定的分类标题下配置菜单项',
  type: 'Array',
  defaultValue: '-',
  id: '4',
}, {
  property: 'onClick',
  explain: '点击事件的处理',
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
    return (
      <div className="intro-dropdown-wrapper">
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
              demo={config.data.dropone.show}
              description={config.data.dropone.description}
              code={dropdownone}
            />
            <Base
              demo={config.data.droptwo.show}
              description={config.data.droptwo.description}
              code={dropdowntwo}
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
