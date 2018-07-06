```javascript
import {Calendar} from 'uskin';
import React from 'react;

const props = {
  width: 242,
  placeholder: '请选择日期',
  page: '2018-2',
  disabled: {
    weeks: [1],
    dates: ['2018-7-1', '2018-7-2'],
  },
  onChange: (data) => { window.alert(`Show date onChange: ${data.date}`); },
  beforeChange: (data) => { window.alert(`Show year beforeChange: ${data.year}`); },
  afterChange: (data) => { window.alert(`Show month afterChange: ${data.month}`); },
};


ReactDOM.render(
  <Calendar ...props />,
  mountNode);
```
