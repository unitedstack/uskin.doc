import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from 'components/navbar/index';
import SideMenu from './sidemenu';
const loader = require('./cores/loader');
const configs = loader.configs;

class Model extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    menus: []
  };

  render() {
    const modules = loader.modules;
    const menus = this.state;

    return (
      <div className="wrapper">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <div className="sidemenu-wrapper">
            <SideMenu />
          </div>
          <div id="main">
          <Switch>
            {
              Object.keys(modules).map((m, i) => {
                let M = modules[m];
                console.log(M);
                return <Route key={i} path={`/${m}`} component={M} />;
              })
            }
            <Redirect to={Object.keys(modules)[0]} />
          </Switch>
          </div>
        </div>
      </div>
    );
  }
}
export default Model;