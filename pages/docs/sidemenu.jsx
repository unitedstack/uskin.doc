import React from 'react';
import { Menu } from 'uskin';
import configs from './menu.json';

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const state = this.state;
    let menus = [];

    configs.modules.forEach((m) => {
      let submenu = [];
      m.items.forEach((n, i) => {
        submenu.push({
          subtitle: `  ${n}`,
          key: n
        });
      });

      menus.push({
        title: m.title,
        key: m.title,
        submenu: submenu
      });
    });
    return (
      <div>
        <Menu items={menus} />
      </div>
    );
  }
}

export default SideMenu;
