```javascript
import {Dropdown} from 'uskin';

var btn = {
  value: 'Dropdown Button',
  iconClass: 'more'
};

var dropdownItems = [{
  items: [{
   title: 'Reboot',
   key: '0'
  }, {
   title: 'Take Image Snapshot',
   key: '1'
  }]
}, {
  items: [{
   title: 'Associate Public IP',
   key: '2'
  }, {
   title: 'Dissociate Public IP',
   key: '3'
  }, {
   title: 'Join Networks',
   key: '4'
  }]
}...];

ReactDOM.render(<div>
  <DropdownButton buttonData={btn} dropdownItems={dropdownItems} dropdownOnClick={listener} />
</div>, mountNode);
```
