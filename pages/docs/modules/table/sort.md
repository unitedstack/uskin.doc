```javascript
import { Table } from 'uskin';

const column = [{
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
}];

const data = [{
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
}];

ReactDOM.render(<div>
  <Table
    column={column}
    data={data}
    dataKey={'id'}/>
</div>, mountNode);
```

