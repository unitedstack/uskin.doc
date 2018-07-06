```javascript
import { Tab } from 'uskin';

const items = [{
  "name": "Word",
  "key": "0"
}, {
  "name": "Excel",
  "key": "1",
  "default": true
}, {
  "name": "PowerPoint",
  "key": "2"
}];

ReactDOM.render(<div>
  <Tab items={items}/>
</div>, mountNode);
```
