```javascript
import { Notification, Button } from 'uskin';

const notices = [{
  title: 'Note:',
  content: 'I am a success notification',
  type: 'success',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 1
}, {
  title: 'Note:',
  content: 'I am a warning notification',
  type: 'warning',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 2
}, {
  title: 'Note:',
  content: 'A classification of architectural styles for network-based application software by the architectural properties they would induce when applied to the architecture for a distributed hypermedia system',
  type: 'danger',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 3
}];

ReactDOM.render(<div>
  <Button
    value="Success"
    type="create"
    onClick={showNotification.bind(this, notices[0])} />
  <Button
    value="Warning"
    type="warning"
    onClick={showNotification.bind(this, notices[1])} />
  <Button
    value="Danger"
    type="delete"
    onClick={showNotification.bind(this, notices[2])} />
</div>, mountNode);
```
