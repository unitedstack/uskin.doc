```javascript
import {Dropdown} from 'uskin';

var items1 = [{
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
  <Dropdown items={items1} />
</div>, mountNode);
```
