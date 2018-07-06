```javascript
import {Breadcrumb} from 'uskin';
import React from 'react';

const items = [{
  name: 'Home',
  href: '#home'
}, {
  name: 'Store',
  href: '#store'
}, {
  name: 'Phones',
  href: '#phone'
}];

const callback = (item, evt) => {
  window.alert(`将跳转到${item.name}，路由是${evt.target.href}`);
};

ReactDOM.render(
  <Breadcrumb items={items} onClick={callback} />,
  mountNode);
```
