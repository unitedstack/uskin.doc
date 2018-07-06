import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdLabel from './label.md';
import mdNumber from './number.md';

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
  property: 'total',
  explain: '页码总数（label 形式的分页不需设置）',
  type: 'Number',
  defaultValue: '-',
  id: '1',
}, {
  property: 'current',
  explain: '当前所在页面的页码（label 形式的分页不需设置）',
  type: 'Number',
  defaultValue: '1',
  id: '2',
}, {
  property: 'labelOnly',
  explain: '使用前后页标志的分页形式，而不是页码的分页形式',
  type: 'Boolean',
  defaultValue: 'false',
  id: '3',
}, {
  property: 'label',
  explain: '前后页标志分页形式下，需要包含哪些标志',
  type: 'Object',
  defaultValue: '-',
  id: '4',
}, {
  property: 'onClick',
  explain: '页码形式下点击分页的回调函数',
  type: 'Function(pageIndex, event)',
  defaultValue: 'noop',
  id: '5',
}, {
  property: 'onClickLabel',
  explain: '前后页标志分页形式下点击分页的回调函数',
  type: 'Function(labelKey, event)',
  defaultValue: 'noop',
  id: '6',
}];

const itemData = [{
  property: 'first',
  explain: '是否显示回到第一页标志',
  type: 'Boolean',
  defaultValue: 'false',
  id: '1',
}, {
  property: 'prev',
  explain: '是否显示上页标志',
  type: 'Boolean',
  defaultValue: 'false',
  id: '2',
}, {
  property: 'next',
  explain: '是否显示下一页标志',
  type: 'Boolean',
  defaultValue: 'false',
  id: '3',
}, {
  property: 'last',
  explain: '是否显示跳转到最后一页标志',
  type: 'Boolean',
  defaultValue: 'false',
  id: '4',
}, {
  property: 'prevDisabled',
  explain: '是否禁用上一页翻页按钮',
  type: 'Boolean',
  defaultValue: 'false',
  id: '5',
}, {
  property: 'nextDisabled',
  explain: '是否禁用下一页翻页按钮',
  type: 'Boolean',
  defaultValue: 'false',
  id: '6',
}];

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    return (
      <div className="intro-pagination-wrapper">
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
              demo={config.data.label_pagination.demo}
              description={config.data.label_pagination.description}
              code={mdLabel}
            />
            <Base
              demo={config.data.number_pagination.demo}
              description={config.data.number_pagination.description}
              code={mdNumber}
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
          <div className="content-title">label</div>
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
