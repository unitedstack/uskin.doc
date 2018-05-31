import './style/index.less';

import ReactDOM from 'react-dom';
import React from 'react';
import Model from './model';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
  <HashRouter>
    <Model />
  </HashRouter>,
  document.getElementById('app')
);
