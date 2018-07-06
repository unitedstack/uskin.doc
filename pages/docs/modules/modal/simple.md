```javascript
import {Modal, Button} from 'uskin';

function popInfo() {
  Modal.info({
    title: 'Info Modal Title',
    content: (
      <div style={{ padding: 20 }}>
        <div>Some Content</div>
        <div>Some Content</div>
        <div>Some Content</div>
      </div>
    )
  });
}

function popSuccess() {
  Modal.success({
    title: 'Success Modal Title',
    content: (
      <div style={{ padding: 20 }}>
        <div>Some Content</div>
        <div>Some Content</div>
        <div>Some Content</div>
      </div>
    )
  });
}

function popWarning() {
  Modal.warning({
    title: 'Warning Modal Title',
    content: (
      <div style={{ padding: 20 }}>
        <div>Some Content</div>
        <div>Some Content</div>
        <div>Some Content</div>
      </div>
    )
  });
}

function popDanger() {
  Modal.danger({
    title: 'Danger Modal Title',
    content: (
      <div style={{ padding: 20 }}>
        <div>Some Content</div>
        <div>Some Content</div>
        <div>Some Content</div>
      </div>
    )
  });
}

ReactDOM.render(
  <div>
    <Button value="Info" onClick={popInfo} />
    <Button value="Success" onClick={popSuccess} />
    <Button value="Warning" onClick={popWarning} />
    <Button value="Danger" onClick={popDanger} />
  </div>,
  mountNode);
```

