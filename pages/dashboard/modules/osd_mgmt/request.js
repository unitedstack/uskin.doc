import fetch from '../../cores/fetch';
import config from './config.json';
import RSVP from 'rsvp';
import getStartAndEndTime from '../../utils/time_range';

const limit = config.table.limit;
const monitorReqUrlPrefix = '/api/monitor/query_range?query=';

// 根据查询时间段的不同，使用不同的 rate 函数
// 据悉短时间段用 irate 计算速度比较快
// 长时间用 rate 比较准确和平滑
// 有问题咨询5小6
function getRateFuncName(timeRange) {
  switch (timeRange) {
    case 'real_time':
    case 'within_three_hours':
    case 'within_one_day':
      return 'irate';
    case 'within_one_week':
    case 'within_one_month':
    case 'within_three_months':
      return 'rate';
    default:
      return '';
  }
}

export default {
  getList: function(pageNumber) {
    const p = pageNumber ? pageNumber : 1;
    const url = `/api/osd?page=${p}&limit=${limit}`;
    return fetch.get({
      url
    });
  },
  getSingleById: function(osdId) {
    const url = `/api/osd/${osdId}`;
    return fetch.get({
      url
    });
  },
  getIOPSMonitorData: function(id, timeRange) {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const rateFuncName = getRateFuncName(timeRange);
    const readUrl = monitorReqUrlPrefix + rateFuncName +
      '(uds_ceph_osd_perf_read_count' + `{osd="osd.${id}"}[5m])` +
      `&start=${start}&end=${end}&step=${step}`;

    const writeUrl = monitorReqUrlPrefix + rateFuncName +
      '(uds_ceph_osd_perf_write_count'+ `{osd="osd.${id}"}[5m])` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      read: fetch.get({
        url: readUrl
      }),
      write: fetch.get({
        url: writeUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        read: res.read.data.result.length !== 0 ? res.read.data.result[0].values : [],
        write: res.write.data.result.length !== 0 ? res.write.data.result[0].values : []
      };
    });
  },
  getBandwidthMonitorData: function(id, timeRange) {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const rateFuncName = getRateFuncName(timeRange);
    const readUrl = monitorReqUrlPrefix + rateFuncName +
      '(uds_ceph_osd_perf_read_bytes' + `{osd="osd.${id}"}[5m])` +
      `&start=${start}&end=${end}&step=${step}`;

    const writeUrl = monitorReqUrlPrefix + rateFuncName +
      '(uds_ceph_osd_perf_write_bytes'+ `{osd="osd.${id}"}[5m])` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      read: fetch.get({
        url: readUrl
      }),
      write: fetch.get({
        url: writeUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        read: res.read.data.result.length !== 0 ? res.read.data.result[0].values : [],
        write: res.write.data.result.length !== 0 ? res.write.data.result[0].values : []
      };
    });
  },
  getWaitTimeMonitorData: function(id, timeRange) {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const readUrl = monitorReqUrlPrefix +
      `idelta(uds_ceph_osd_perf_read_latency_count{osd="osd.${id}"}[5m])` +
      '/1000/1000' + `&start=${start}&end=${end}&step=${step}`;

    const writeUrl = monitorReqUrlPrefix +
      `idelta(uds_ceph_osd_perf_write_latency_count{osd="osd.${id}"}[5m])` +
      '/1000/1000' + `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      read: fetch.get({
        url: readUrl
      }),
      write: fetch.get({
        url: writeUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        read: res.read.data.result.length !== 0 ? res.read.data.result[0].values : [],
        write: res.write.data.result.length !== 0 ? res.write.data.result[0].values : []
      };
    });
  }
};