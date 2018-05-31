import React from 'react';
import ReactDOM from 'react-dom';
import Base from './base';
import {history} from 'ufec';

function modal(props) {

  let doc = document,
    root = doc.getElementById('modal-container'),
    container = null;

  if (!root) {
    root = doc.createElement('div');
    root.id = 'modal-container';

    doc.body.appendChild(root);
  }

  container = doc.createElement('div');
  root.appendChild(container);


  // location发生改变时destroy掉pop
  const unlisten = history.listen(destroy);

  function destroy() {
    root && root.parentNode && root.parentNode.removeChild(root);
    ReactDOM.unmountComponentAtNode(root);
    unlisten();
  }

  function onAfterClose() {
    destroy();
  }

  let _props = {
    ...props,
    root,
    onAfterClose
  };

  ReactDOM.render(<Base {..._props}/>, container);
}

export default modal;
