import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import Model from './model';
import './style/index.less';

ReactDOM.render(
  <HashRouter>
    <Model />
  </HashRouter>,
  document.getElementById('app'),
);

hljs.initHighlightingOnLoad();
