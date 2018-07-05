```javascript
import {Tip} from 'uskin';
import React from 'react';

const props = {
  type: 'warning',
  title: '哇！',
  width: 320,
  content: '这就触及到我的知识盲区了。',
  showIcon: true,
  enableClose: true,
};

ReactDOM.render(
  <Tip ...props />,
  mountNode);
```
