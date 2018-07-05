```javascript
import { Notification, Button } from 'uskin';

const notices = [{
  title: 'Note:',
  content: 'I am content',
  showIcon: true,
  isAutoHide: true,
  duration: 5,
  width: 300,
  id: 1
}, {
  title: 'Note:',
  content: 'I am a info notification',
  type: 'info',
  showIcon: true,
  isAutoHide: false,
  width: 300,
  id: 2
}];

ReactDOM.render(<div>
  <Button
    value="用户定义时间的通知"
    onClick={showNotification.bind(this, notices[0])} />
  <Button
    value="不会自动关闭的通知"
    onClick={showNotification.bind(this, notices[1])} />
</div>, mountNode);
```
