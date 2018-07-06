```javascript
import {Modal} from 'uskin';

const props = {
  title: 'Modal Title',
  children: (
    <div style={{ padding: 20 }}>
      <div>Some Content</div>
      <div>Some Content</div>
      <div>Some Content</div>
    </div>
  )
};

ReactDOM.render(
  <div>
    <Modal props={props} />
  </div>,
  mountNode);
```
