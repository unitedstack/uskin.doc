import fetch from 'client/applications/dashboard/cores/fetch';
import config from './config.json';
import getStartAndEndTime from '../../utils/time_range';

const RSVP = require('rsvp');
const limit = config.table.limit;
const monitorReqUrlPrefix = '/api/monitor/query_range?query=';

export default {
  getList: function(page) {
    let p = page ? page : 1;
    return fetch.post({
      url: `/api/rgw/get-user-list?page=${p}&limit=${limit}`
    });
  },

  getListById: function(id) {
    return fetch.post({
      url: '/api/rgw/get-single-user',
      data: {id: id}
    });
  },

  createUser: function(data) {
    return fetch.post({
      url: '/api/rgw/create-user',
      data: data
    });
  },

  updateUser: function(data) {
    return fetch.post({
      url: '/api/rgw/update-user',
      data: data
    });
  },

  deleteUser: function(rows, puurgeData) {
    let deferredList = [],
      data = {};
    rows.forEach((row) => {
      data.uid = row.id;
      if(puurgeData) {
        data['purge-data'] = true;
      }
      deferredList.push(fetch.post({
        url: '/api/rgw/delete-user',
        data: data
      }));
    });
    return RSVP.all(deferredList);
  },

  createUserQuota: function(data) {
    return fetch.post({
      url: '/api/rgw/update-user-quota',
      data: data
    });
  },

  createBucketQuota: function(data) {
    return fetch.post({
      url: '/api/rgw/update-bucket-quota',
      data: data
    });
  },

  getUserQuota: function() {
    return fetch.post({
      url: '/api/rgw/get-user-quota'
    });
  },

  modifyKey: function(data) {
    return fetch.post({
      url: '/api/rgw/create-key',
      data: data
    });
  },

  deleteKey: function(items) {
    let deferredList = [];
    let dataKey;
    items['access-key'].forEach((item) => {
      dataKey = {
        'access-key': item
      };
      deferredList.push(fetch.post({
        url: '/api/rgw/delete-key',
        data: dataKey
      }));
    });
    return RSVP.all(deferredList);
  },

  getBucketList: function(data) {
    return fetch.post({
      url: '/api/rgw/get-bucket-list',
      data: data
    });
  },

  //上传带宽
  getUploadBandwidth: (user, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'irate(uds_ceph_rgw_user_total_received_bytes' + `{user="${user}"}[5m])`+
      `&start=${start}&end=${end}&step=${step}`;
    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0],[end, 0]];
    });
  },
  //下载带宽
  getDownloadBandwidth: (user, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'irate(uds_ceph_rgw_user_total_sent_bytes' + `{user="${user}"}[5m])` +
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0],[end, 0]];
    });
  },
  //上传次数
  getUploadtime: (user, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'irate(uds_ceph_rgw_user_upload_ops' + `{user="${user}"}[5m])`+
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0],[end, 0]];
    });
  },
  //下载次数
  getDownloadtime: (user, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'irate(uds_ceph_rgw_user_download_ops' + `{user="${user}"}[5m])`+
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0],[end, 0]];
    });
  }
};