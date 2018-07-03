import React from 'react';
import './style/index.less';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <div className="docs-com-navbar">
        <h1 style={{ color: '#fff' }}>this is navbar</h1>
      </div>
    );
  }
}

export default NavBar;
