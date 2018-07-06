import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.js';
import breadcrumbDemo from './breadcrumb.md';

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
  property: 'items（必填）',
  explain: '面包屑内容',
  type: 'Array',
  defaultValue: '[]',
  id: '1',
}, {
  property: 'onClick',
  explain: '点击地址的回调函数，参数为点击项名称和地址组成的对象以及事件对象',
  type: 'Function',
  defaultValue: '() => {}',
  id: '2',
}];

const itemsData = [{
  property: 'name',
  explain: '显示在页面上的地址名称',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'href',
  explain: '跳转地址',
  type: 'String',
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
              demo={config.data.breadcrumb.demo}
              description={config.data.breadcrumb.description}
              code={breadcrumbDemo}
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
        <div className="API-wrapper">
          <div className="content-title">items</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={itemsData}
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
