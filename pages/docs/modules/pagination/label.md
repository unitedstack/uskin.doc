```javascript
import {Pagination} from 'uskin';

const label = {
  first: true,
  prev: true,
  next: true,
  last: true
};

function onClickLabel(key, evt) {
  console.log(key)
}

ReactDOM.render(
  <div>
    <Pagination label={label} labelOnly={true} onClickLabel={onClickLabel} />
  </div>,
  mountNode);
```
