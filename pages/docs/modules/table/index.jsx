import { Table } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdDefault from './default.md';
import mdCheckbox from './checkbox.md';
import mdSort from './sort.md';

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
  property: 'column',
  explain: '设置表格标题内容',
  type: 'Array',
  defaultValue: '-',
  id: '1',
}, {
  property: 'data',
  explain: '每行数据',
  type: 'Array',
  defaultValue: '-',
  id: '2',
}, {
  property: 'dataKey',
  explain: '每行数据的唯一标识',
  type: 'String',
  defaultValue: '-',
  id: '3',
}, {
  property: 'checkbox',
  explain: '是否选择数据行',
  type: 'Boolean',
  defaultValue: 'false',
  id: '4',
}, {
  property: 'striped',
  explain: '设置true以启用每行之间的颜色区分',
  type: 'Boolean',
  defaultValue: 'false',
  id: '5',
}, {
  property: 'hover',
  explain: '设置true以使颜色在行上悬停时发生变化',
  type: 'Boolean',
  defaultValue: 'false',
  id: '6',
}, {
  property: 'checkboxInitialize',
  explain: '初始化时设置选中的行',
  type: 'Function',
  defaultValue: '-',
  id: '7',
}, {
  property: 'checkboxOnChange',
  explain: 'checkbox触发事件的Handler',
  type: 'Function',
  defaultValue: '-',
  id: '8',
}];

const columnData = [{
  property: 'title',
  explain: 'table头部的标题',
  type: 'String',
  defaultValue: '-',
  id: '1',
}, {
  property: 'dataIndex',
  explain: '设置索引以获取相关数据',
  type: 'String',
  defaultValue: '-',
  id: '2',
}, {
  property: 'width',
  explain: 'table列宽度',
  type: 'String',
  defaultValue: '-',
  id: '3',
}, {
  property: 'sortBy',
  explain: '按某列值排序表数据',
  type: 'Function',
  defaultValue: '-',
  id: '4',
}, {
  property: 'filter',
  explain: '设置筛选器以获取具有特定字段值的数据项',
  type: 'Function',
  defaultValue: '-',
  id: '5',
}];

const tableData = {
  default: {
    demo: {
      data: [{
        type: 'table',
        config: {
          dataKey: 'id',
          column: [{
            title: 'ID',
            width: '150px',
            key: 'id',
            dataIndex: 'id',
          }, {
            title: 'Category',
            width: '120px',
            key: 'category',
            dataIndex: 'category',
          }, {
            title: 'Level',
            key: 'level',
            dataIndex: 'level',
          }, {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
          }, {
            title: 'Double Price',
            key: 'double_price',
            render: (col, item) => (<div style={{ color: '#f78913' }}>{item.price * 2}</div>),
          }],
          data: [{
            id: 1,
            category: 'Micro-1',
            level: 'First Level',
            price: '0.056',
          }, {
            id: 2,
            category: 'Standard-3',
            level: 'Second Level',
            price: '0.444',
          }, {
            id: 3,
            category: 'Micro-2',
            level: 'Third Level',
            price: '0.056',
          }, {
            id: 4,
            category: 'Standard-2',
            level: 'Fourth Level',
            price: '0.444',
          }],
        },
      }],
    },
    description: {
      hide: true,
      content: '简单的表格',
    },
  },
  checkbox: {
    demo: {
      data: [{
        type: 'table',
        config: {
          dataKey: 'id',
          checkbox: true,
          striped: true,
          hover: true,
          column: [{
            title: 'ID',
            width: '150px',
            key: 'id',
            dataIndex: 'id',
          }, {
            title: 'Category',
            width: '120px',
            key: 'category',
            dataIndex: 'category',
          }, {
            title: 'Level',
            key: 'level',
            dataIndex: 'level',
          }, {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
          }, {
            title: 'Double Price',
            key: 'double_price',
            render: (col, item) => (<div style={{ color: '#f78913' }}>{item.price * 2}</div>),
          }],
          data: [{
            id: 1,
            category: 'Micro-1',
            level: 'First Level',
            price: '0.056',
          }, {
            id: 2,
            category: 'Standard-3',
            level: 'Second Level',
            price: '0.444',
          }, {
            id: 3,
            category: 'Micro-2',
            level: 'Third Level',
            price: '0.056',
          }, {
            id: 4,
            category: 'Standard-2',
            level: 'Fourth Level',
            price: '0.444',
          }],
        },
      }],
    },
    description: {
      hide: true,
      content: 'checkbox: 设置是否选择数据行; striped: 设置true以启用每行之间的颜色区分; hover: 设置true以使颜色在行上悬停时发生变化。',
    },
  },
  sort: {
    demo: {
      data: [{
        type: 'table',
        config: {
          dataKey: 'id',
          checkbox: true,
          column: [{
            title: 'ID',
            width: '150px',
            key: 'id',
            dataIndex: 'id',
            sortBy: 'number',
            filter: [{
              name: 'id >= 2',
              key: '1',
              filterBy: (item) => {
                if (item.id >= 2) return true;
                return false;
              },
            }, {
              name: 'id < 2',
              key: '2',
              filterBy: (item) => {
                if (item.id < 2) return true;
                return false;
              },
            }],
          }, {
            title: 'Category',
            width: '120px',
            key: 'category',
            dataIndex: 'category',
          }, {
            title: 'Level',
            key: 'level',
            dataIndex: 'level',
            filter: [{
              name: 'level 1',
              key: '1',
              filterBy: item => item.level.localeCompare('First Level') === 0,
            }, {
              name: 'level 2',
              key: '2',
              filterBy: item => item.level.localeCompare('Second Level') === 0,
            }, {
              name: 'level 3',
              key: '3',
              filterBy: item => item.level.localeCompare('Third Level') === 0,
            }, {
              name: 'level 4',
              key: '4',
              filterBy: item => item.level.localeCompare('Fourth Level') === 0,
            }],
          }, {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
          }, {
            title: 'Double Price',
            key: 'double_price',
            sortBy: (item1, item2) => {
              if (item1.price * 2 > item2.price * 2) {
                return 1;
              } else if (item1.price * 2 < item2.price * 2) {
                return -1;
              }

              return 0;
            },
            render: (col, item) => (<div style={{ color: '#f78913' }}>{item.price * 2}</div>),
          }],
          data: [{
            id: 1,
            category: 'Micro-1',
            level: 'First Level',
            price: '0.056',
          }, {
            id: 2,
            category: 'Standard-3',
            level: 'Second Level',
            price: '0.444',
          }, {
            id: 3,
            category: 'Micro-2',
            level: 'Third Level',
            price: '0.056',
          }, {
            id: 4,
            category: 'Standard-2',
            level: 'Fourth Level',
            price: '0.444',
          }],
        },
      }],
    },
    description: {
      hide: true,
      content: '筛选排序',
    },
  },
};

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    config.data = tableData;

    function getCode(key) {
      switch (key) {
        case 'default':
          return mdDefault;
        case 'checkbox':
          return mdCheckbox;
        default:
          return mdSort;
      }
    }

    return (
      <div className="intro-table-wrapper">
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
          <div className="content-title">Table.column</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={columnData}
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
