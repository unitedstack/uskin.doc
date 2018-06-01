import './style/index.less';
import React from 'react';

import mdTest from './test.md';

class Model extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{fontSize: 50}}>这边儿是组件</div>
        <div style={{fontSize: 20}}>以下为代码演示</div>
        <span dangerouslySetInnerHTML={{__html: mdTest}}></span>
      </div>
    );
  }

}

module.exports = Model;
