import fetch from '../../cores/fetch';

let osdSidHeader;

export default {
  getList: function(pageNumber, getOsdSidHeader) {
    const p = pageNumber ? pageNumber : 1;
    const url = `/api/mgr/osd/stats?page=${p}&limit=0`;
    let needHeader;
    let headers;

    if(getOsdSidHeader === true) {
      needHeader = true;
    } else {
      needHeader = false;
      headers = {
        'osd-sid': osdSidHeader
      };
    }

    return fetch.get({
      url,
      needHeader: needHeader,
      headers: headers
    }).then(res => {
      if(needHeader) {
        osdSidHeader = res.that.getResponseHeader('osd-sid');
        return res.body;
      } else {
        return res;
      }
    });
  },
  getOsdList: (poolClass) => {
    return fetch.get({
      url: '/api/osd?class=' + poolClass
    });
  },
  getSinglePool: (poolName) => {
    return fetch.get({
      url: '/api/pool/' + poolName
    });
  },
  getPoolList: () => {
    return fetch.get({
      url: '/api/pool'
    });
  },
};