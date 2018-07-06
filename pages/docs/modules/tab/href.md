```javascript
import { Tab } from 'uskin';

const items = [{
  "name": "Uskin",
  "key": "0",
  "href": "https://github.com/icecreamliker/uskin"
}, {
  "name": "Table",
  "key": "1",
  "default": true
}, {
  "name": "Slider",
  "key": "2"
}];

ReactDOM.render(<div>
  <Tab items={items}/>
</div>, mountNode);
```
