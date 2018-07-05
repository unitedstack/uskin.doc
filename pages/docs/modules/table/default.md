```javascript
import { Table } from 'uskin';

const column = [{
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

