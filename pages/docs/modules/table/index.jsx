import './style/index.less';

import React from 'react';

class Model extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{fontSize: 50}}>
        这边儿是组件Table哈哈哈
      </div>
    );
  }

}

module.exports = Model;
