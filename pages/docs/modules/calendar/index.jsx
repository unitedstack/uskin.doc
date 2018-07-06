import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.js';
import calendar1Demo from './calendar1.md';
import calendar2Demo from './calendar2.md';

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
  property: 'page',
  explain: '设置点开日历显示的年月,比如2018-02。设置selectedDate此项无效',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'selectedDate',
  explain: '初始选中的日期，比如2018-07-06',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'placeholder',
  explain: '站位符',
  type: 'String',
  defaultValue: '-',
  id: '3',
}, {
  property: 'startWeek',
  explain: '起始星期,0~6表示周日至周一',
  type: 'Number',
  defaultValue: '0',
  id: '4',
}, {
  property: 'disabled',
  explain: '进选日期，见下方详细说明',
  type: 'Object',
  defaultValue: '-',
  id: '5',
}, {
  property: 'local',
  explain: '星期、月份显示方式，见下方详细说明',
  type: 'Object',
  defaultValue: '-',
  id: '6',
}, {
  property: 'width',
  explain: '选择栏宽度',
  type: 'Number',
  defaultValue: '161',
  id: '7',
}, {
  property: 'beforeChange',
  explain: '点击日期发生改变前的回调函数，参数是选中日期（年，月，日）',
  type: 'Function',
  defaultValue: '() => {}',
  id: '8',
}, {
  property: 'onChange',
  explain: '点击日期发生改变时的回调函数，参数同上',
  type: 'Function',
  defaultValue: '() => {}',
  id: '9',
}, {
  property: 'afterChange',
  explain: '点击日期发生改变后的回调函数，参数同上',
  type: 'Function',
  defaultValue: '() => {}',
  id: '10',
}];

const disabledData = [{
  property: 'min',
  explain: '小于此年月的日期皆不可被选',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'max',
  explain: '大于等于此年月的日期皆不可被选',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'weeks',
  explain: '数组元素要求是数字类型，0~6表示周日至周一',
  type: 'Array',
  defaultValue: '-',
  id: '3',
}, {
  property: 'max',
  explain: '例["2018-07-01", "2018-07-02"]',
  type: 'Array',
  defaultValue: '-',
  id: '4',
}];

const localData = [
  {
    property: 'weeks',
    explain: '元素为需要的星期格式，比如["星期一", "星期二", ...]',
    type: 'Array',
    defaultValue: '-',
    id: '1',
  }, {
    property: 'months',
    explain: '元素为需要的月份格式, 比如["一月", "二月", ...]',
    type: 'Array',
    defaultValue: '-',
    id: '2',
  },
];

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
              demo={config.data.calendar1.demo}
              description={config.data.calendar1.description}
              code={calendar1Demo}
            />
            <Base
              demo={config.data.calendar2.demo}
              description={config.data.calendar2.description}
              code={calendar2Demo}
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
          <div className="content-title">disabled</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={disabledData}
              dataKey="id"
              checkbox={false}
              striped={false}
              hover={false}
            />
          </div>
        </div>
        <div className="API-wrapper">
          <div className="content-title">local</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={localData}
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
