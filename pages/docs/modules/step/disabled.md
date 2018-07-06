```javascript
import {Step} from 'uskin';

const items = [{
  name: 'First'
}, {
  name: 'Second',
  default: true
}, {
  name: 'Third'
}]

ReactDOM.render(
  <div>
    <Step items={items} width={350} disabled={true} />
  </div>,
  mountNode);
```
