import RSVP from 'rsvp';
import fetch from 'client/applications/dashboard/cores/fetch';
import config from './config.json';
import getStartAndEndTime from '../../utils/time_range';
import moment from 'moment';
const limit = config.table.limit;

const monitorReqUrlPrefix = '/api/monitor/query_range?query=';

export default {
  getList: (type, page, pageLimit) => {
    let p = page ? page : 1,
      pLimit = pageLimit || limit;
    return fetch.get({
      url: `/api/pool?page=${p}&limit=${pLimit}&type=${type}`
    });
  },
  getSingle: (poolName) => {
    return fetch.get({
      url: '/api/pool/' + poolName
    });
  },
  getOsdTreeList: () => {
    return fetch.get({
      url: '/api/osd/tree'
    });
  },
  modifyOsd: (ids, poolName) => {
    return fetch.put({
      url: '/api/pool/' + poolName +'/osd',
      data: {
        osds: ids
      }
    });
  },
  deletePools: (rows) => {
    let deferredList = [];
    rows.forEach((row) => {
      deferredList.push(fetch.delete({
        url: '/api/pool/' + row.pool_name
      }));
    });
    return RSVP.all(deferredList);
  },
  getOsdList: (poolClass) => {
    return fetch.get({
      url: '/api/osd?class=' + poolClass
    });
  },
  createPool: (data) => {
    return fetch.post({
      url: '/api/pool',
      data: data
    });
  },
  modifyPool: (data, poolName) => {
    return fetch.put({
      url: '/api/pool/' + poolName,
      data: data
    });
  },
  createRelatedPool(poolName, cachePoolName, data) {
    let url = `/api/pool/${poolName}/cache/${cachePoolName}`;
    return fetch.post({
      url,
      data
    });
  },
  updateRelatedPool(poolName, cachePoolName, data) {
    let url = `/api/pool/${poolName}/cache/${cachePoolName}`;
    return fetch.put({
      url,
      data
    });
  },
  deleteRelatedPool(poolName, cachePoolName) {
    return fetch.delete({
      url: `/api/pool/${poolName}/cache/${cachePoolName}`
    });
  },
  getIopsMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const iopsReadUrl = monitorReqUrlPrefix + `uds_ceph_pool_client_read_op_per_second{pool="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;
    const iopsWritedUrl = monitorReqUrlPrefix + `uds_ceph_pool_client_write_op_per_second{pool="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;
    const iopsRestoreUrl = monitorReqUrlPrefix + `uds_ceph_pool_recovering_op_per_second{pool="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      readIops: fetch.get({
        url: iopsReadUrl
      }),
      writeIops: fetch.get({
        url: iopsWritedUrl
      }),
      restoreIops: fetch.get({
        url: iopsRestoreUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        read_iops: res.readIops.data.result[0] ? res.readIops.data.result[0].values : [[start, 0], [end, 0]],
        write_iops: res.writeIops.data.result[0] ? res.writeIops.data.result[0].values : [[start, 0], [end, 0]],
        restore_iops: res.restoreIops.data.result[0] ? res.restoreIops.data.result[0].values : [[start, 0], [end, 0]]
      };
    });
  },
  getRateMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const bandwidthReadUrl = monitorReqUrlPrefix + `uds_ceph_pool_client_read_bytes_per_second{pool="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;
    const bandwidthWritedUrl = monitorReqUrlPrefix + `uds_ceph_pool_client_write_bytes_per_second{pool="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      read_bandwidth: fetch.get({
        url: bandwidthReadUrl
      }),
      write_bandwidth: fetch.get({
        url: bandwidthWritedUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      let data = {};
      ['read_bandwidth', 'write_bandwidth'].forEach(m => {
        data[m] = res[m].data.result[0] ? res[m].data.result[0].values : [[start, 0], [end, 0]];
      });

      return data;
    });
  },
  getCapacityMonitorData: (id, timeRange) => {
    let time, dayRange;
    const { start, end, step } = getStartAndEndTime(timeRange);

    switch(timeRange) {
      case 'within_one_day':
        time = 24 * 60 * 60;
        dayRange = '7d';
        break;
      case 'within_one_week':
        time = 7 * 24 * 60 * 60;
        dayRange = '7d';
        break;
      case 'within_one_month':
        time = 30 * 24 * 60 * 60;
        dayRange = '30d';
        break;
      case 'within_three_months':
        time = 3 * 30 * 24 * 60 * 60;
        dayRange = '90d';
        break;
      default:
        time =  3 * 60 * 60;
        dayRange = '7d';
        break;
    }

    const url = monitorReqUrlPrefix + `predict_linear(uds_ceph:pool_used_ratio{pool="${id}"}[${dayRange}], ${time})` +
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0], [end, 0]];
    });
  },
  getHistoryMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'uds_ceph_pool_raw_used_bytes' + `{pool="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0], [end, 0]];
    });
  },
  getDataStatus: (id) => {
    const req = '/api/monitor/query?query=';

    const healthyUrl = req + `uds_ceph_pool_pgs_healthy{pool="${id}"}` +
      `&time=${moment().unix()}`;
    const degradedUrl = req + `uds_ceph_pool_pgs_degraded{pool="${id}"}` +
      `&time=${moment().unix()}`;
    const recoveryUrl = req + `uds_ceph_pool_pgs_recovery_wait{pool="${id}"}` +
    `&time=${moment().unix()}`;
    const unusableUrl = req + `uds_ceph_pool_pgs_unusable{pool="${id}"}` +
    `&time=${moment().unix()}`;
    const totalUrl = req + `uds_ceph_pool_pgs_total{pool="${id}"}` +
    `&time=${moment().unix()}`;

    const reqs = {
      healthy: fetch.get({
        url: healthyUrl
      }),
      degraded: fetch.get({
        url: degradedUrl
      }),
      wait_recovery: fetch.get({
        url: recoveryUrl
      }),
      unavailable: fetch.get({
        url: unusableUrl
      }),
      total: fetch.get({
        url: totalUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      let data = {};
      ['healthy', 'degraded', 'wait_recovery', 'unavailable', 'total'].forEach(m => {
        data[m] = res[m].data.result[0] ? res[m].data.result[0].value[1]  : 0;
      });

      return data;
    });
  }
};
