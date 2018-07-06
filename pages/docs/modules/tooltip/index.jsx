import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdShape from './shape.md';
import mdType from './type.md';
import mdWidth from './width.md';
import mdHide from './hide.md';

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
  property: 'shape',
  explain: '设置三角的方向,可选值有 top-left, top, top-right, right-top, right, right-bottom, bottom-right, bottom, bottom-left, left-bottom, left, left-top',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'type',
  explain: '设置 tooltip 的类型，可以设置 error tooltip',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'content',
  explain: 'tooltip 的文字内容',
  type: 'String',
  defaultValue: '-',
  id: '3',
}, {
  property: 'hide',
  explain: '是否隐藏 tooltip',
  type: 'Boolean',
  defaultValue: 'false',
  id: '4',
}, {
  property: 'width',
  explain: 'tooltip 的宽度',
  type: 'Number',
  defaultValue: '-',
  id: '5',
}];

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  // shape type hide

  render() {
    return (
      <div className="intro-tooltip-wrapper">
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
            <div className="shape">
              <Base
                demo={config.data.shape.demo}
                description={config.data.shape.description}
                code={mdShape}
              />
            </div>
            <div className="type">
              <Base
                demo={config.data.type.demo}
                description={config.data.type.description}
                code={mdType}
              />
            </div>
            <div className="width">
              <Base
                demo={config.data.width.demo}
                description={config.data.width.description}
                code={mdWidth}
              />
            </div>
            <div className="hidden">
              <Base
                demo={config.data.hide.demo}
                description={config.data.hide.description}
                code={mdHide}
              />
            </div>
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
