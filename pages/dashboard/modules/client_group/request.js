import fetch from '../../cores/fetch';
import config from './config.json';
import { Promise } from 'rsvp';
const limit = config.table.limit;

export default {
  getList: function(pageNumber) {
    const p = pageNumber ? pageNumber : 1;
    const url = `/api/iscsi/host-group?page=${p}&limit=${limit}`;
    return fetch.get({
      url
    });
  },
  getClients: function() {
    const url = '/api/iscsi/iqn?limit=0';
    return fetch.get({
      url
    });
  },
  getDisks: function() {
    const url = '/api/iscsi/disk';
    return fetch.get({
      url
    });
  },
  getClientsAndDisks: function() {
    const reqs = [
      fetch.get({
        url: '/api/iscsi/iqn?limit=0'
      }),
      fetch.get({
        url: '/api/iscsi/disk'
      })
    ];

    return Promise.all(reqs).then(res => {
      return {
        clients: res[0].data,
        disks: res[1].data
      };
    });
  },
  createClientGroup: function(data) {
    const url = '/api/iscsi/host-group';
    return fetch.post({
      url, data
    });
  },
  editClientGroup: function(group, data) {
    const url = `/api/iscsi/host-group/${group}`;
    return fetch.put({
      url, data
    });
  },
  associateVolumes: function(group, data) {
    const url = `/api/iscsi/host-group/${group}`;
    return fetch.put({
      url, data
    });
  },
  deleteClientGroup: function(group) {
    const url = `/api/iscsi/host-group/${group}`;
    return fetch.delete({
      url
    });
  }
};