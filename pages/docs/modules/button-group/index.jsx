import { Table, Button } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdBthGroupOne from './btngroupone.md';
import mdBthGroupTwo from './btngrouptwo.md';
import mdBthGroupThree from './btngroupthree.md';
import mdBthGroupFour from './btngroupfour.md';

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
  explain: '设置按钮类型，或将钮扣组设置为垂直或横向。',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'value',
  explain: '按钮上显示的文字。',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'width',
  explain: '设置按钮的宽度或按钮组的宽度。',
  type: 'String',
  defaultValue: '104px',
  id: '3',
}];

const demoOne = {
  data: [{
    type: 'buttonGroup',
    config: {
      children:
  <div>
    <Button tag="div" value="Prev" />
    <Button tag="div" value="Mid 1" type="delete" />
    <Button tag="div" value="Mid 2" disabled={!false} />
    <Button tag="div" value="Next" type="create" />
  </div>,
    },
  }],
};

const descriptionOne = {
  hide: true,
  content: '在ButtonGroup标签的包装中添加组件按钮，每个按钮的值都可以配置。',
};

const demoTwo = {
  data: [{
    type: 'buttonGroup',
    config: {
      type: 'vertical',
      width: '220px',
      children:
  <div className="btn-group-vertical" style={{ width: '220px' }}>
    <Button tag="div" value="Justified Prev" />
    <Button tag="div" value="Justified Mid 1" type="delete" />
  </div>,
    },
  }],
};

const descriptionTwo = {
  hide: true,
  content: '设置按钮组的宽度属性，定义对齐按钮的整体宽度。',
};

const demoThree = {
  data: [{
    type: 'buttonGroup',
    config: {
      children:
  <div>
    <Button tag="div" value="Prev" type="status" selected={!false} />
    <Button tag="div" value="Mid 1" type="status" />
    <Button tag="div" value="Mid 2" disabled={!false} />
    <Button tag="div" value="Next" type="create" />
  </div>,
    },
  }],
};

const descriptionThree = {
  hide: true,
  content: '将按钮组的类型设置为垂直。',
};

const demoFour = {
  data: [{
    type: 'buttonGroup',
    config: {
      type: 'vertical',
      width: '220px',
      children:
  <div className="btn-group-vertical" style={{ width: '220px' }}>
    <Button tag="div" value="Prev" type="status" selected={!false} />
    <Button tag="div" value="Mid 1" type="status" />
    <Button tag="div" value="Mid 2" disabled={!false} />
    <Button tag="div" value="Next" type="create" />
  </div>,
    },
  }],
};

const descriptionFour = {
  hide: true,
  content: '设置按钮组的类型和宽度。',
};

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    return (
      <div className="intro-button-group-wrapper">
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
            <div className="base-container-left">
              <Base
                demo={demoOne}
                description={descriptionOne}
                code={mdBthGroupOne}
              />
              <Base
                demo={demoThree}
                description={descriptionThree}
                code={mdBthGroupThree}
              />
            </div>
            <div className="base-container-right">
              <Base
                demo={demoTwo}
                description={descriptionTwo}
                code={mdBthGroupTwo}
              />
              <Base
                demo={demoFour}
                description={descriptionFour}
                code={mdBthGroupFour}
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
