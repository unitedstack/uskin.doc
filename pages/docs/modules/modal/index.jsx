import { Table, Modal } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdBase from './base.md';
import mdSimple from './simple.md';
import mdWidth from './width.md';
import pop from './pop';

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
  property: 'title',
  explain: '模态框标题',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'width',
  explain: '宽度',
  type: 'Number',
  defaultValue: '540',
  id: '2',
}, {
  property: 'children',
  explain: '模态框的内容',
  type: 'String | ReactNode',
  defaultValue: '-',
  id: '3',
}, {
  property: 'visible',
  explain: '受控模态框，由父组件决定模态框的显示与隐藏',
  type: 'Boolean',
  defaultValue: '-',
  id: '4',
}, {
  property: 'parent',
  explain: '嵌套弹出模态框时的父模态框',
  type: 'DOMElement',
  defaultValue: '-',
  id: '5',
}, {
  property: 'onAfterClose',
  explain: '点击模态框右上角关闭按钮的回调函数',
  type: 'Function',
  defaultValue: 'noop',
  id: '6',
}, {
  property: 'onCancel',
  explain: '打开模态框后按下键盘 ESC 键的回调函数',
  type: 'Function',
  defaultValue: 'noop',
  id: '7',
}, {
  property: 'onConfirm',
  explain: '打开模态框后按下键盘 Enter 键的回调函数',
  type: 'Function',
  defaultValue: 'noop',
  id: '8',
}];

const itemData = [{
  property: 'title',
  explain: '标题',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'width',
  explain: '宽度',
  type: 'Number',
  defaultValue: '540',
  id: '2',
}, {
  property: 'content',
  explain: '内容部分',
  type: 'String | ReactNode',
  defaultValue: '-',
  id: '3',
}, {
  property: 'okText',
  explain: '按钮的文案',
  type: 'String',
  defaultValue: '-',
  id: '4',
}, {
  property: 'onAfterClose',
  explain: '同 Modal',
  type: 'Function',
  defaultValue: 'noop',
  id: '5',
}, {
  property: 'onCancel',
  explain: '同 Modal',
  type: 'Function',
  defaultValue: 'noop',
  id: '6',
}, {
  property: 'onConfirm',
  explain: '同 Modal',
  type: 'Function',
  defaultValue: 'noop',
  id: '7',
}];

config.data.base.demo.data[0].config.onClick = function cb() {
  pop({
    title: 'Modal Title',
    children: (
      <div style={{ padding: 20 }}>
        <div>Some Content</div>
        <div>Some Content</div>
        <div>Some Content</div>
      </div>
    ),
  });
};

config.data.simple.demo.data.forEach((item) => {
  item.config.onClick = function cb() {
    const props = {
      title: `${item.config.value} Modal Title`,
      okText: 'Confirm',
      content: (
        <div style={{ padding: 20 }}>
          <div>Some Content</div>
          <div>Some Content</div>
          <div>Some Content</div>
        </div>
      ),
    };
    Modal[item.config.value.toLowerCase()](props);
  };
});

config.data.width.demo.data.forEach((item) => {
  item.config.onClick = function cb() {
    const props = {
      title: 'Modal Title',
      width: Number(item.config.value.slice(0, 3)),
      children: (
        <div style={{ padding: 20 }}>
          <div>Some Content</div>
          <div>Some Content</div>
          <div>Some Content</div>
        </div>
      ),
    };
    pop(props);
  };
});


class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    return (
      <div className="intro-modal-wrapper">
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
              demo={config.data.simple.demo}
              description={config.data.simple.description}
              code={mdSimple}
            />
            <Base
              demo={config.data.width.demo}
              description={config.data.width.description}
              code={mdWidth}
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
          <div className="content-title">Modal.method()</div>
          <ul>
            <li>Modal.info</li>
            <li>Modal.success</li>
            <li>Modal.warning</li>
            <li>Modal.danger</li>
          </ul>
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
