require('./style/index.less');

import React from 'react';
import ReactDOM from 'react-dom';
import Base from './base';
import {history} from 'ufec';

function modal(obj, callback) {

  let doc = document,
    root = doc.getElementById('modal-container');

  if (!root) {
    root = doc.createElement('div');
    root.id = 'modal-container';
    doc.body.appendChild(root);
  }

  const unlisten = history.listen(destroy);

  function destroy() {
    ReactDOM.unmountComponentAtNode(root);
    root.parentNode && root.parentNode.removeChild(root);
    unlisten();
  }

  function onAfterClose() {
    destroy();
  }

  let _props = {
    onAfterClose: onAfterClose,
    obj: obj,
    callback: callback
  };

  return ReactDOM.render(<Base {..._props}/>, root);
}

export default modal;
