import fetch from '../../cores/fetch';

export default {
  getList: function() {
    const url = '/api/mgr/pool/stats';

    return fetch.get({
      url: url
    });
  }
};