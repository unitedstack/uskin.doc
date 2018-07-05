```javascript
import {Dropdown} from 'uskin';

var items2 = [{
  title: 'Basic Ops',
  key: 'basic',
  items: [{
    title: 'Reboot',
    key: '0',
    onClick: listener
  }, {
    title: 'Take Image Snapshot',
    key: '1',
    onClick: listener
  }]
  }, {
  title: 'Network Ops',
  key: 'network',
  items: [{
    title: 'Associate Public IP',
    key: '2',
    onClick: listener
  }, {
    title: 'Dissociate Public IP',
    key: '3',
    onClick: listener
  }, {
    title: 'Join Networks',
    key: '4',
    onClick: listener
  }]
  }...]

ReactDOM.render(<div>
  <Dropdown items={items2} />
</div>, mountNode);
```
