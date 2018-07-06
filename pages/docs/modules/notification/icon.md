```javascript
import { Notification, Button } from 'uskin';

const notices = [{
  title: 'Note:',
  content: 'I am a notification',
  icon: 'loading-notification',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 1
}, {
  title: 'Note:',
  content: 'I am a danger notification',
  type: 'danger',
  showIcon: false,
  isAutoHide: true,
  width: 300,
  id: 2
}];

ReactDOM.render(<div>
  <Button
    value="用户定义图标显示通知"
    onClick={showNotification.bind(this, notices[0])} />
  <Button
    value="没有图标的通知"
    onClick={showNotification.bind(this, notices[1])} />
</div>, mountNode);
```
