```javascript
import {Calendar} from 'uskin';
import React from 'react;

const props = {
  width: 242,
  local: {
    weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },
  selectedDate: (() => {
    const now = new Date();
    const date = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    return `${year}-${month + 1}-${date}`;
  })(),
  disabled: {
    min: '2017-5',
    max: '2019',
  },
};


ReactDOM.render(
  <Calendar ...props />,
  mountNode);
```
