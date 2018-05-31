import fetch from '../../cores/fetch';
import config from './config.json';
const limit = config.table.limit;

export default {
  getList: function(pageNumber) {
    const p = pageNumber ? pageNumber : 1;
    const url = `/api/iscsi/iqn?page=${p}&limit=${limit}`;
    return fetch.get({
      url
    });
  },
  getSingleById: function(clientName) {
    const url = `/api/iscsi/iqn/${clientName}`;
    return fetch.get({
      url
    });
  },
  createClient: function(data) {
    const url = '/api/iscsi/iqn';
    return fetch.post({
      url, data
    });
  },
  updateClient: function(clientName, data) {
    const url = `/api/iscsi/iqn/${clientName}/auth`;

    return fetch.put({
      url, data
    });
  },
  getVolumes: function() {
    const url = '/api/iscsi/disk';
    return fetch.get({
      url
    }).then(res => {
      return res.data;
    });
  },
  deleteClient: function(clientName) {
    const url = `/api/iscsi/iqn/${clientName}`;
    return fetch.delete({
      url
    });
  },
  associateVolumes: function(clientName, disks) {
    // 注意现在关联存储卷，和取关存储卷好像都是一个接口
    // 只要把关联的存储卷传入就好了
    const url = `/api/iscsi/iqn/${clientName}/disk`;
    return fetch.put({
      url,
      data: {
        disks
      }
    });
  },
  disassociateVolume: function(clientName, disks) {
    const url = `/api/iscsi/iqn/${clientName}/disk`;
    return fetch.put({
      url,
      data: {
        disks: disks
      }
    });
  }
};