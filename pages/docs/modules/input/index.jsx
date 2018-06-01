import React from 'react';
import mdTest from './test.md';
import './style/index.less';

const Model = () => (
  <div>
    <div style={{ fontSize: 50 }}>这边儿是组件</div>
    <div style={{ fontSize: 20 }}>以下为代码演示</div>
    <span dangerouslySetInnerHTML={{ __html: mdTest }} />
  </div>
);

module.exports = Model;
