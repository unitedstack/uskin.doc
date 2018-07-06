```javascript
import { Tab } from 'uskin';

const items = [{
  "name": "Uskin",
  "key": "0"
}, {
  "name": "Table",
  "key": "1",
  "default": true
}, {
  "name": "Slider",
  "key": "2",
  "disabled": true
}];

ReactDOM.render(<div>
  <Tab items={items}/>
</div>, mountNode);
```
