```javascript
import {Menu} from 'uskin';
import React from 'react;

const props = {
  width: 320,
  toggle: true,
  items: [
    {
      title: '中式点心',
      fold: true,
      submenu: [{
        subtitle: '奶酪饽饽',
        key: '奶酪饽饽',
        onClick: (evt, item) => { window.alert(`选${item.subtile}?(这个回调函数来自items参数内部。)`); },
      }, {
        subtitle: '牛舌饼',
        key: '牛舌饼',
        onClick: (evt, item) => { window.alert(`选${item.subtile}?(这个回调函数来自items参数内部。)`); },
      }, {
        subtitle: '山楂锅盔',
        key: '山楂锅盔',
        onClick: (evt, item) => { window.alert(`选${item.subtile}?(这个回调函数来自items参数内部。)`); },
      }],
      key: '中式点心',
    },
    {
      title: '西式蛋糕',
      submenu: [{
        subtitle: '拿破仑',
        key: '拿破仑',
      }, {
        subtitle: '黑森林',
        key: '黑森林',
      }, {
        subtitle: '蓝莓慕斯',
        key: '蓝莓慕斯',
      },
      ],
      key: '西式蛋糕',
    },
  ],
  onClick: (evt, item) => { window.alert(`选${item.subtitle}?（这个回调函数来自items参数外部。）`); },
};

ReactDOM.render(
  <Menu ...props />,
  mountNode);
```
