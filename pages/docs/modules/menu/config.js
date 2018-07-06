export default {
  title: 'Menu',
  title_cn: '导航菜单',
  simple_description: '为页面提供侧向菜单列表导航。',
  data: {
    menu: {
      demo: {
        data: [{
          type: 'menu',
          config: {
            width: 320,
            toggle: true,
            items: [
              {
                title: '中式点心',
                fold: true,
                submenu: [{
                  subtitle: '奶酪饽饽',
                  key: '奶酪饽饽',
                  onClick: (evt, item) => { window.alert(`选${item.subtile}?(这个回调函数来自items参数内部。)`); },
                }, {
                  subtitle: '牛舌饼',
                  key: '牛舌饼',
                  onClick: (evt, item) => { window.alert(`选${item.subtile}?(这个回调函数来自items参数内部。)`); },
                }, {
                  subtitle: '山楂锅盔',
                  key: '山楂锅盔',
                  onClick: (evt, item) => { window.alert(`选${item.subtile}?(这个回调函数来自items参数内部。)`); },
                }],
                key: '中式点心',
              },
              {
                title: '西式蛋糕',
                submenu: [{
                  subtitle: '拿破仑',
                  key: '拿破仑',
                }, {
                  subtitle: '黑森林',
                  key: '黑森林',
                }, {
                  subtitle: '蓝莓慕斯',
                  key: '蓝莓慕斯',
                },
                ],
                key: '西式蛋糕',
              },
            ],
            onClick: (evt, item) => { window.alert(`选${item.subtitle}?（这个回调函数来自items参数外部。）`); },
          },
        },
        ],
      },
      description: {
        hide: true,
        content: '导航菜单是页面应用的核心部件，可以通过菜单项在各个页面间跳转浏览。这个示例设置了所有的参数，详细说明见下方api列表。',
      },
    },
  },
};
