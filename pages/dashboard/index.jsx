import './style/index.less';

import ReactDOM from 'react-dom';
import React from 'react';
import Model from './model';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Model />
  </BrowserRouter>,
  document.getElementById('app')
);
