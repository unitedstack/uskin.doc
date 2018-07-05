export default {
  title: 'Tip',
  title_cn: '提示框',
  simple_description: '提示框用于信息提示，类型包括普通提示，成功，警告，错误。',
  data: {
    info: {
      demo: {
        data: [{
          type: 'tip',
          config: {
            title: '逍遥游',
            content: '北冥有鱼，其名为鲲，鲲之大，一锅炖不下。化而为鸟，其名为鹏，鹏之大，需要两个烧烤架，一个蜜汁，一个麻辣。',
            width: 320,
            type: 'info',
            showIcon: true,
          },
        },
        ],
      },
      description: {
        hide: true,
        content: '这个示例描述了<Tip>组件最基本的用法，使用的是info类型，用于一般的信息提示。',
      },
    },
    success: {
      demo: {
        data: [{
          type: 'tip',
          config: {
            type: 'success',
            title: '中奖啦！',
            width: 320,
            content: '家有万金，行止随心。',
            icon: 'icon-avatar',
          },
        }],
      },
      description: {
        hide: true,
        content: '这个示例使用了<Tip>组件的success类型，用于当某些操作成功的时候进行提示。这个示例使用了icon属性，当传入icon后，showIcon属性如果设为true，其效果将被覆盖，显示为icon传入的值。',
      },
    },
    warning: {
      demo: {
        data: [{
          type: 'tip',
          config: {
            type: 'warning',
            title: '哇！',
            width: 320,
            content: '这就触及到我的知识盲区了。',
            showIcon: true,
            enableClose: true,
          },
        }],
      },
      description: {
        hide: true,
        content: '这个示例使用了<Tip>组件的waring类型，用于发出警告提示时使用。这个示例使用了enableClose属性，该属性默认值为false，当设为true时，会在提示框的右侧出现一个关闭按钮，点击即可关闭该提示框。',
      },
    },
    danger: {
      demo: {
        data: [{
          type: 'tip',
          config: {
            type: 'danger',
            title: '否认三连！',
            width: 320,
            content: '没有！不是！我没说过！',
            showIcon: true,
            isAutoHide: true,
          },
        }],
      },
      description: {
        hide: true,
        content: '这个示例使用了<Tip>组件的danger类型，用于操作出现错误时进行提示。这个示例使用了isAutoHide属性，该属性默认值为false，当设为true时，提示框出现后三秒将自动隐藏。',
      },
    },
  },
};
