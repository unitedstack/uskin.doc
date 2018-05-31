import fetch from 'client/libs/fetch';

export default {
  getTrees: function() {
    return fetch.get({
      url: '/api/osd/tree'
    });
  }
};
