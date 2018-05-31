import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import loader from './cores/loader';
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
      <div id="wrapper">
        <div className="main-content">
          <Route children={({ location }) => (
            <div className="garen-com-menu">
              <SideMenu
                __={__}
                collapsed={this.state.collapsed}
                location={location}
                items={menus}/>
            </div>
          )}/>
          <div id="main-wrapper" className="main-wrapper">
            <div id="navbar">
              <Navbar __={__} collapsed={this.state.collapsed} onClick={this.toggleMenu.bind(this)} />
            </div>
            <div id="main">
              <Switch>
                {
                  Object.keys(modules).map((m, i) => {
                    const M = modules[m];
                    return <Route key={i} path={`/${m}`} component={M} />;
                  })
                }
                <Redirect to={Object.keys(modules)[0]} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Model;