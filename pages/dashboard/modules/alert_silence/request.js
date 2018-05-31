import fetch from '../../cores/fetch';

export default {
  getList: function() {
    const url = '/api/alerta/silence';
    return fetch.get({
      url
    });
  },
  createAlertSilence: function(data) {
    return fetch.post({
      url: '/api/alerta/silence',
      data: data
    });
  },
  getServers: function() {
    return fetch.get({
      url: '/api/openstack/nodes?limit=0'
    }).then(res => {
      return res.data.map(server => {
        return {
          id: server.id,
          name: server.instance_info && server.instance_info.display_name || ''
        };
      });
    });
  },
  deleteAlertSilence: function(alartId) {
    return fetch.delete({
      url: `/api/alerta/silence/${alartId}`
    });
  }
};