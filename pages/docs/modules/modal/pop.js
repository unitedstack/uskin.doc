import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'uskin';

function modal(props) {
  let container = null;

  let mask = null;
  const doc = document;
  let root = doc.getElementById('modal-container');

  if (!root) {
    root = doc.createElement('div');
    root.id = 'modal-container';

    mask = doc.createElement('div');
    mask.classList.add('modal-mask');
    root.appendChild(mask);

    doc.body.appendChild(root);
  }
  container = doc.createElement('div');
  root.appendChild(container);


  function destory() {
    ReactDOM.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
  }

  function onAfterClose() {
    destory();
  }

  const newProps = Object.assign({}, props, {
    onAfterClose,
  });

  ReactDOM.render(<Modal {...newProps} />, container);
}

module.exports = modal;
