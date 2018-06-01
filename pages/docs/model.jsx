import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from 'components/navbar/index';
import Menu from 'components/menu/index';
import SideMenu from './sidemenu';
const loader = require('./cores/loader');
const configs = loader.configs;


class Model extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: {
        items:[
          {
            title: 'modules',
            hide: false,
            subs:[
              {
                subtitle: 'Breadcrumb',
                subtitleCn: '面包屑',
              },
              {
                subtitle: 'Button',
                subtitleCn: '按钮',
              },
              {
                subtitle: 'Button Group',
                subtitleCn: '按钮组',
              },
              {
                subtitle: 'input',
                subtitleCn: '输入框',
              }
            ]
          }
        ]
      }
    };
  }

  onAction (type, data) {
    switch(type) {
      case 'menu':
        this.handleMenu(data);
        break;
      default: break;
    }
  }
  handleMenu(data) {
    let menus = JSON.parse(JSON.stringify(this.state.menus));
    switch(data.subType) {
      case 'title':
        menus.items.forEach(i => {
          i.title === data.title ? i.hide = !i.hide: null;
        });
        break;
      case 'subtitle':
        menus.items.forEach(item => {
          if (item.title === data.title) {
            item.hide = false;
            item.subs.forEach(i => {
              i.selected = i.subtitle == data.subtitle ? true: false;
            })
          } else {
            item.hide = true;
            item.subs.forEach(i => {
              i.selected = false;
            })
          }
        });
        break;
      default: break;
    }
    this.setState({
      menus
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
        <Menu {...state.menus} onAction={this.onAction.bind(this)}></Menu>
        <div className="content">
          <div className="sidemenu-wrapper">
            <SideMenu />
          </div>
          <div id="main">
          <Switch>
            {
              Object.keys(modules).map((m, i) => {
                let M = modules[m];
                return <Route key={i} path={`/${m}`} component={M} />;
              })
            }
            {/*<Redirect to={Object.keys(modules)[0]} />*/}
          </Switch>
          </div>
        </div>
      </div>
    );
  }
}
export default Model;