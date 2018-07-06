```javascript
import { Tab } from 'uskin';

const items = [{
  "name": "Piano",
  "key": "0"
}, {
  "name": "Violin",
  "key": "1",
  "default": true
}, {
  "name": "Guitar",
  "key": "2"
}];

ReactDOM.render(<div>
  <Tab items={items} type="sm"/>
</div>, mountNode);
```
