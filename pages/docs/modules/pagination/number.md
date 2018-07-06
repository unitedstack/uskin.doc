```javascript
import {Pagination} from 'uskin';

function handleClick(key, evt) {
  console.log(key)
}

ReactDOM.render(
  <div>
    <Pagination total={10} current={3} onClick={handleClick} />
  </div>,
  mountNode);
```
