import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from 'components/navbar/index';
import Menu from 'components/menu/index';

const loader = require('./cores/loader');

class Model extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: loader.configs,
    };
  }

  onAction = (type, data) => {
    switch (type) {
      case 'menu':
        this.handleMenu(data);
        break;
      default: break;
    }
  }

  handleMenu(data) {
    const menus = JSON.parse(JSON.stringify(this.state.menus));
    switch (data.subType) {
      case 'title':
        menus.items.forEach((i) => {
          if (i.title === data.title) {
            i.hide = !i.hide;
          }
        });
        break;
      case 'subtitle':
        menus.items.forEach((item) => {
          if (item.title === data.title) {
            item.hide = false;
            item.subs.forEach((i) => {
              i.selected = i.subtitle === data.subtitle;
            });
          } else {
            item.hide = true;
            item.subs.forEach((i) => {
              i.selected = false;
            });
          }
        });
        break;
      default: break;
    }
    this.setState({
      menus,
    });
  }

  render() {
    const modules = loader.modules;
    const state = this.state;

    return (
      <div className="wrapper">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Menu {...state.menus} onAction={this.onAction} />
          <div id="main">
            <Switch>
              {
                Object.keys(modules).map((m, i) => {
                  const M = modules[m];
                  return <Route key={i} path={`/${m}`} component={M} />;
                })
              }
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
export default Model;
