import fetch from '../../cores/fetch';
import config from './config.json';
import RSVP from 'rsvp';
const limit = config.table.limit;

export default {
  getList: function(pageNumber, resource, level, server, status) {
    const p = pageNumber ? pageNumber : 1;
    let url = `/api/alerta/alert?page=${p}&page-size=${limit}`;

    if(resource !== 'all') {
      url += `&service=${resource}`;
    }

    if(level === 'all') {
      url += '&severity=informational&severity=warning&severity=major&severity=critical';
    } else {
      url += `&severity=${level}`;
    }

    if(server !== 'all' && (resource === 'all' || resource === 'server')) {
      url += `&tags="host_id=${server}"`;
    }

    if(status !== 'all') {
      url += '&status=open';
    }
    return fetch.get({
      url
    });
  },
  getCountAndServerList: function() {
    const reqs = {
      count: fetch.get({
        url: '/api/alerta/alert/count?severity=informational&severity=warning&severity=major&severity=critical'
      }),
      servers: fetch.get({
        url: '/api/openstack/nodes?limit=0'
      })
    };

    return RSVP.hash(reqs).then(res => {
      const severityCounts = res.count.severityCounts;
      const statusCounts = res.count.statusCounts;
      return {
        count: {
          informational: severityCounts.informational !== undefined ? severityCounts.informational : 0,
          warning: severityCounts.warning !== undefined ? severityCounts.warning : 0,
          major: severityCounts.major !== undefined ? severityCounts.major : 0,
          critical: severityCounts.critical !== undefined ? severityCounts.critical : 0,
          unread: statusCounts.open !== undefined ? statusCounts.open : 0
        },
        servers: res.servers.data.map(item => {
          return {
            id: item.id,
            name: item.instance_info.display_name || ''
          };
        })
      };
    });
  },
  markAsRead: function(id) {
    return fetch.put({
      url: `/api/alerta/alert/${id}/read`
    });
  }
};