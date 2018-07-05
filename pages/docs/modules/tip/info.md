```javascript
import {Tip} from 'uskin';
import React from 'react';

const props = {
  title: '逍遥游',
  content: '北冥有鱼，其名为鲲，
    鲲之大，一锅炖不下。
    化而为鸟，其名为鹏，
    鹏之大，需要两个烧烤架，
    一个蜜汁，一个麻辣。',
  width: 320,
  type: 'info',
  showIcon: true
};

ReactDOM.render(
  <Tip ...props />,
  mountNode);
```
