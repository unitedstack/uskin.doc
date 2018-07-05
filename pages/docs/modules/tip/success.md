```javascript
import {Tip} from 'uskin';
import React from 'react';

const props = {
  type: 'success',
  title: '中奖啦！',
  width: 320,
  content: '家有万金，行止随心。',
  icon: 'icon-avatar',
};

ReactDOM.render(
  <Tip ...props />,
  mountNode);
```
