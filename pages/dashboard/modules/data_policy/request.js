import fetch from 'client/applications/dashboard/cores/fetch';
import config from './config.json';
const RSVP = require('rsvp');
const limit = config.table.limit;

export default {
  getList: function(page) {
    let p = page ? page : 1;
    return fetch.get({
      url: `/api/rgw/placement?page=${p}&limit=${limit}`
    });
  },
  getSingleList: function(id) {
    return fetch.get({
      url: `/api/rgw/placement/${id}`,
    });
  },
  getAllList: function() {
    return fetch.get({
      url: '/api/rgw/placement?limit=0'
    });
  },
  getPoolList: function() {
    return fetch.get({
      url: '/api/pool'
    });
  },
  createPolicy: function(data) {
    return fetch.post({
      url: '/api/rgw/placement',
      data: data
    });
  },
  setDefault: function(id) {
    return fetch.put({
      url: '/api/rgw/placement/default/' + id,
      id: id
    });
  },
  modifyPolicy: function(data) {
    return fetch.put({
      url: '/api/rgw/placement/' + data.name,
      data: data
    });
  },
  deletePolicy: function(rows) {
    let deferredList = [];
    rows.forEach((row) => {
      deferredList.push(fetch.delete({
        url: '/api/rgw/placement/' + row.id
      }));
    });
    return RSVP.all(deferredList);
  }
};

