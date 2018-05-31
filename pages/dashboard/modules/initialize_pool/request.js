import fetch from 'client/applications/dashboard/cores/fetch';

export default {
  getOsdTreeList: () => {
    return fetch.get({
      url: '/api/osd/tree'
    });
  },
  init: (data) => {
    return fetch.post({
      url: '/api/rgw/init',
      data: data
    });
  }
};
