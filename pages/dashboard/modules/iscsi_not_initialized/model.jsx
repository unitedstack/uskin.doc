import './style/index.less';

import React from 'react';
import __ from 'client/locale/dashboard.lang.json';

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="garen-module-iscsi_not_initialized">
        <div className="wrapper">
          <div className="inner">
            <img src="/public/assets/dashboard/iscsi_not_initialized.png"/>
            <div className="info">{__.iscsi_not_initialized_info}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Model;
