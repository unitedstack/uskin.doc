import './style/index.less';

import React from 'react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    collapsed: this.props.collapsed,
    visible: false,
    totalAlertCount: 0,
    alertList: {}
  };

  componentDidMount() {
  }

  render() {
    return (
      <div className="docs-com-navbar">
        this is navbar
      </div>
    );
  }
}

export default NavBar;
