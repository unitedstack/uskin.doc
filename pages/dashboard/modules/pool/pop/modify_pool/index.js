require('./style/index.less');

import React from 'react';
import ReactDOM from 'react-dom';
import Base from './base';
import {history} from 'ufec';

function modal(parent, obj, callback) {

  let container = null;

  let doc = document.getElementById('main'),
    root = document.getElementById('modal-container');

  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-container';
    doc.appendChild(root);
  }
  container = document.createElement('div');
  root.appendChild(container);

  const unlisten = history.listen(destroy);

  function destroy() {
    root.parentNode && root.parentNode.removeChild(root);
    ReactDOM.unmountComponentAtNode(root);
    unlisten();
  }

  function onAfterClose() {
    destroy();
  }

  let _props = {
    onAfterClose: onAfterClose,
    parent: parent,
    obj: obj,
    callback: callback
  };

  return ReactDOM.render(<Base {..._props}/>, container);
}

export default modal;
