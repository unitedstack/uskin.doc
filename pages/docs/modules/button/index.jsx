import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdType from './type.md';
import mdSize from './size.md';

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
  explain: '设置按钮类型',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'disabled',
  explain: '设置按钮是否有效',
  type: 'Boolean',
  defaultValue: 'false',
  id: '2',
}, {
  property: 'initial',
  explain: 'Put value "true" to set the button to initial styled.',
  type: 'Boolean',
  defaultValue: 'false',
  id: '3',
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
          <div className="content-title">项目</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={[]}
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
