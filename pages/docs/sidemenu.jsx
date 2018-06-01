import React from 'react';
import { Menu } from 'uskin';
import configs from './menu.json';

const SideMenu = () => {
  const menus = [];

  configs.modules.forEach((m) => {
    const submenu = [];
    m.items.forEach((n) => {
      submenu.push({
        subtitle: `  ${n}`,
        key: n,
      });
    });

    menus.push({
      title: m.title,
      key: m.title,
      submenu,
    });
  });
  return (
    <div>
      <Menu items={menus} />
    </div>
  );
};

export default SideMenu;
