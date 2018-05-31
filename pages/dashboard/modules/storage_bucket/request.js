import RSVP from 'rsvp';
import fetch from 'client/applications/dashboard/cores/fetch';
import config from './config.json';
import getStartAndEndTime from '../../utils/time_range';

const limit = config.table.limit;
const monitorReqUrlPrefix = '/api/monitor/query_range?query=';

export default {
  getList: (page) => {
    let p = page ? page : 1;
    return fetch.post({
      url: `/api/rgw/get-bucket-list?page=${p}&limit=${limit}`
    });
  },
  getListById: (id) => {
    return fetch.post({
      url: '/api/rgw/get-single-bucket',
      data: {
        id: id
      }
    });
  },
  getBucketPolicy: (data) => {
    return fetch.post({
      url: '/get-bucket-policy',
      data: data
    });
  },
  deleteBuckets: (rows, purgeObjects) => {
    let deferredList = [],
      data = {};
    rows.forEach((row) => {
      data.bucket = row.bucket;
      if (purgeObjects) {
        data['purge-objects'] = true;
      }
      deferredList.push(fetch.post({
        url: '/api/rgw/delete-bucket',
        data: data
      }));
    });
    return RSVP.all(deferredList);
  },
  createBucket: (data) => {
    return fetch.post({
      url: '/api/rgw/create-bucket',
      data: data
    });
  },
  getUserList: () => {
    return fetch.post({
      url: '/api/rgw/get-user-list'
    });
  },
  linkOwner: (uid, bucket, bucketId) => {
    return fetch.post({
      url: '/api/rgw/link-bucket',
      data: {
        uid: uid,
        bucket: bucket,
        'bucket-id': bucketId
      }
    });
  },
  unlinkOwner: (uid, bucket, bucketId) => {
    return fetch.post({
      url: '/api/rgw/unlink-bucket',
      data: {
        uid: uid,
        bucket: bucket
      }
    });
  },
  enableBucketQuota: (bucket) => {
    return fetch.post({
      url: '/api/rgw/enable-single-bucket-quota',
      data: {
        bucket: bucket
      }
    });
  },
  disableBucketQuota: (bucket) => {
    return fetch.post({
      url: '/api/rgw/disable-single-bucket-quota',
      data: {
        bucket: bucket
      }
    });
  },
  updateBucketQuota: (data) => {
    return fetch.post({
      url: '/api/rgw/update-single-bucket-quota',
      data: data
    });
  },
  getAcl: (bucket) => {
    return fetch.post({
      url: '/api/rgw/get-bucket-acl',
      data: {bucket: bucket}
    });
  },
  updateAcl: (data) => {
    return fetch.post({
      url: '/api/rgw/update-bucket-acl',
      data: data
    });
  },
  getDataPolicy: function() {
    return fetch.get({
      url: '/api/rgw/placement?limit=0'
    });
  },
  //上传总量
  getUploadTotal: (user, bucket, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + `uds_ceph_rgw_bucket_upload_received_bytes{user="${user}",bucket="${bucket}"}` +
      `&start=${start}&end=${end}&step=${step}`;
    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0],[end, 0]];
    });
  },
  //下载总量
  getDownloadTotal: (user, bucket, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + `uds_ceph_rgw_bucket_download_sent_bytes{user="${user}",bucket="${bucket}"}` +
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0],[end, 0]];
    });
  }
};
