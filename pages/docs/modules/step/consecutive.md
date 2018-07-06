```javascript
import {Step} from 'uskin';

const items = [{
  name: 'First'
}, {
  name: 'Second'
}, {
  name: 'Third',
  default: true
}, {
  name: 'Fourth'
}]

ReactDOM.render(
  <div>
    <Step items={items} width={350} consecutive={true} />
  </div>,
  mountNode);
```
