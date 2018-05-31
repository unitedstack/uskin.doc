import './style/index.less';
import React from 'react';
import { Button, Spin, Icon, Alert } from 'antd';
import __ from 'client/locale/dashboard.lang.json';

import Initialize from './pop/initialize/index';

class InitializePool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibile: false
    };
  }

  onClick() {
    Initialize();
  }

  getStatus() {
    const GAREN = window.GAREN;
    const status = GAREN.rgw.status;
    switch(status) {
      case 'initializing':
        return {
          uninitialized: false,
          initializing: true,
          failure: false
        };
      case 'error':
        return {
          uninitialized: false,
          initializing: false,
          failure: true
        };
      default:
        return {
          uninitialized: true,
          initializing: false,
          failure: false
        };
    }
  }

  render() {
    const GAREN = window.GAREN;
    let status = this.getStatus();

    return <div className="initialize-pool">
      <div className="margin-wrapper">
        <div className="initial-wrapper">
          <div className="zero-wrapper">
            <div className="bg-wrapper"></div>
            <div className="word-wrapper">{__.init_info}</div>
            <div className={status.initializing ? 'spin-wrapper' : 'hide'}>
              <Spin tip={__.init_loading}
                indicator={<Icon type="loading" style={{fontSize: 30}} />}/>
            </div>
            <div className={status.failure ? 'failure-wrapper' : 'hide'}>
              <Alert type="error" showIcon message={GAREN.rgw.message || __.init_failure}/>
            </div>
            <Button
              type="primary"
              disabled={status.initializing}
              className={!status.initializing ? 'btn-wrapper' : 'btn-wrapper disabled'}
              onClick={this.onClick.bind(this)}>
              {__.init_btn_info}
            </Button>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default InitializePool;