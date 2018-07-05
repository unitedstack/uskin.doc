import { Table, Notification } from 'uskin';
import React from 'react';
import Base from 'components/base/index';
import './style/index.less';
import highlight from '../../cores/highlight';
import config from './config.json';
import mdDefault from './default.md';
import mdStatus from './status.md';
import mdIcon from './icon.md';
import mdRemove from './remove.md';

const column = [{
  title: '属性',
  width: '200px',
  key: 'property',
  dataIndex: 'property',
}, {
  title: '类型',
  width: '100px',
  key: 'type',
  dataIndex: 'type',
}, {
  title: '参数',
  width: '150px',
  key: 'parameter',
  dataIndex: 'parameter',
}, {
  title: '描述',
  key: 'explain',
  dataIndex: 'explain',
  render(col, item) {
    return <div style={{ wordWrap: 'break-word' }}>{item.explain}</div>;
  },
}];

const data = [{
  property: 'Notification.addNotice',
  explain: '弹出通知',
  type: 'Function',
  parameter: '通知数据对象',
  id: '1',
}, {
  property: 'Notification.removeNotice',
  explain: '删除通知',
  type: 'Function',
  parameter: '想要删除的通知id',
  id: '2',
}, {
  property: 'Notification.updateNotice',
  explain: '将通知更改为新样式',
  type: 'Function',
  parameter: '新通知数据对象',
  id: '3',
}];

const notices = [{
  title: 'Note:',
  content: 'I am content',
  showIcon: true,
  isAutoHide: true,
  duration: 5,
  width: 300,
  id: 1,
}, {
  title: 'Note:',
  content: 'I am a info notification',
  type: 'info',
  showIcon: true,
  isAutoHide: false,
  width: 300,
  id: 2,
}, {
  title: 'Note:',
  content: 'I am a success notification',
  type: 'success',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 3,
}, {
  title: 'Note:',
  content: 'I am a warning notification',
  type: 'warning',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 4,
}, {
  title: 'Note:',
  content: 'A classification of architectural styles for network-based application'
    + ' software by the architectural properties they would induce when applied'
    + ' to the architecture for a distributed hypermedia system',

  type: 'danger',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 5,
}, {
  title: 'Note:',
  content: 'I am a notification',
  icon: 'loading-notification',
  showIcon: true,
  isAutoHide: true,
  width: 300,
  id: 6,
}, {
  title: 'Note:',
  content: 'I am a danger notification',
  type: 'danger',
  showIcon: false,
  isAutoHide: true,
  width: 300,
  id: 7,
}];

function showNotification(noticeVar) {
  const notice = {};

  Object.keys(noticeVar).forEach((key) => {
    notice[key] = noticeVar[key];
  });

  Notification.addNotice(notice);
}

function removeNotification() {
  Notification.removeNotice(2);
}

function updateNotification() {
  const notice = {};

  Object.keys(notices[0]).forEach((key) => {
    notice[key] = notices[0][key];
  });

  notice.id = 2;
  Notification.updateNotice(notice);
}

const dataDemo = {
  default: {
    demo: {
      data: [{
        type: 'button',
        config: {
          value: '用户定义时间的通知',
          onClick: showNotification.bind(this, notices[0]),
        },
      }, {
        type: 'button',
        config: {
          value: '不会自动关闭的通知',
          onClick: showNotification.bind(this, notices[1]),
        },
      }],
    },
    description: {
      hide: true,
      content: '用户定义的持续时间的通知',
    },
  },
  status: {
    demo: {
      data: [{
        type: 'button',
        config: {
          value: 'Success',
          type: 'create',
          onClick: showNotification.bind(this, notices[2]),
        },
      }, {
        type: 'button',
        config: {
          value: 'Warning',
          type: 'warning',
          onClick: showNotification.bind(this, notices[3]),
        },
      }, {
        type: 'button',
        config: {
          value: 'Danger',
          type: 'delete',
          onClick: showNotification.bind(this, notices[4]),
        },
      }],
    },
    description: {
      hide: true,
      content: '不同状态的通知',
    },
  },
  icon: {
    demo: {
      data: [{
        type: 'button',
        config: {
          value: '用户定义图标显示通知',
          onClick: showNotification.bind(this, notices[5]),
        },
      }, {
        type: 'button',
        config: {
          value: '没有图标的通知',
          onClick: showNotification.bind(this, notices[6]),
        },
      }],
    },
    description: {
      hide: true,
      content: '图标可以被自定义。',
    },
  },
  remove: {
    demo: {
      data: [{
        type: 'button',
        config: {
          value: '通知1',
          onClick: showNotification.bind(this, notices[0]),
        },
      }, {
        type: 'button',
        config: {
          value: '通知2',
          onClick: showNotification.bind(this, notices[1]),
        },
      }, {
        type: 'button',
        config: {
          value: '将通知2更新为1',
          onClick: updateNotification,
        },
      }, {
        type: 'button',
        config: {
          value: '删除通知2',
          onClick: removeNotification,
        },
      }],
    },
    description: {
      hide: true,
      content: '更新／删除通知',
    },
  },
};

class Model extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = highlight;

  render() {
    config.data = dataDemo;

    function getCode(key) {
      switch (key) {
        case 'icon':
          return mdIcon;
        case 'status':
          return mdStatus;
        case 'remove':
          return mdRemove;
        default:
          return mdDefault;
      }
    }

    return (
      <div className="intro-notification-wrapper">
        <div className="simple-description-wrapper">
          <div className="content-title">
            <span>{config.title}</span>
            <span>{config.title_cn}</span>
          </div>
          <div className="content">
            {config.simple_description}
          </div>
        </div>
        <div className="base-wrapper">
          <div className="title">基础用法</div>
          <div className="base-container-wrapper">
            {
              Object.keys(config.data).map(key => (<Base
                key={key}
                demo={config.data[key].demo}
                description={config.data[key].description}
                code={getCode(key)}
              />))
            }
          </div>
        </div>
        <div className="API-wrapper">
          <div className="content-title">API</div>
          <div>
            <Table
              width="90%"
              column={column}
              data={data}
              dataKey="id"
              checkbox={false}
              striped={false}
              hover={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Model;
