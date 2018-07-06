export default {
  title: 'Calendar',
  title_cn: '日历',
  simple_description: '选择型日历，用来选定日期。',
  data: {
    calendar1: {
      demo: {
        data: [{
          type: 'calendar',
          config: {
            width: 242,
            local: {
              weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
              months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            },
            selectedDate: (() => {
              const now = new Date();
              const date = now.getDate();
              const month = now.getMonth();
              const year = now.getFullYear();
              return `${year}-${month + 1}-${date}`;
            })(),
            disabled: {
              min: '2017-5',
              max: '2019',
            },
          },
        },
        ],
      },
      description: {
        hide: true,
        content: '这个示例配置了width、local、selectedDate以及disabled（使用min，max）参数。selectedDate参数存在的时候，page及placeholder参数效果将被覆盖。',
      },
    },
    calendar2: {
      demo: {
        data: [{
          type: 'calendar',
          config: {
            width: 242,
            placeholder: '请选择日期',
            page: '2018-2',
            disabled: {
              weeks: [1],
              dates: ['2018-7-1', '2018-7-2'],
            },
            onChange: (data) => { window.alert(`Show date onChange: ${data.date}`); },
            beforeChange: (data) => { window.alert(`Show year beforeChange: ${data.year}`); },
            afterChange: (data) => { window.alert(`Show month afterChange: ${data.month}`); },
          },
        },
        ],
      },
      description: {
        hide: true,
        content: '这个示例配置了width、placeholder、page、disabled（使用weeks，dates）以及onChange、beforeChange、afterChange三个时刻的回调函数。',
      },
    },
  },
};
