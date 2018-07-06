```javascript
import {Tip} from 'uskin';
import React from 'react';

const props = {
  type: 'danger',
  title: '否认三连！',
  width: 320,
  content: '没有！不是！我没说过！',
  showIcon: true,
  isAutoHide: true,
};

ReactDOM.render(
  <Tip ...props />,
  mountNode);
```