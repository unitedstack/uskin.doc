export default {
  title: 'Breadcrumb',
  title_cn: '面包屑',
  simple_description: '面包屑是在用户界面中的一种导航辅助，用于确定和转移位置的一种方法。',
  data: {
    breadcrumb: {
      demo: {
        data: [{
          type: 'breadcrumb',
          config: {
            items: [{
              name: 'Home',
              href: 'docs.html#/breadcrumb',
            }, {
              name: 'Store',
              href: 'docs.html#/breadcrumb',
            }, {
              name: 'Phones',
              href: 'docs.html#/breadcrumb',
            },
            ],
            onClick: (item, evt) => { window.alert(`将跳转到${item.name}，路由是${evt.target.href}`); },
          },
        },
        ],
      },
      description: {
        hide: true,
        content: '<Breadcrumb>组件会显示当前和上层各级位置，可通过点击切换位置。',
      },
    },
  },
};
