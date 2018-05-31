import fetch from 'client/applications/dashboard/cores/fetch';
import config from './config.json';
import getStartAndEndTime from '../../utils/time_range';
import RSVP from 'rsvp';
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
  getList: (page) => {
    let p = page ? page : 1;
    return fetch.get({
      url: `/api/openstack/nodes?page=${p}&limit=${limit}`
    });
  },
  getListById: (id) => {
    return fetch.get({
      url: `/api/openstack/node/${id}`
    });
  },
  getCPUMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + `base_system:cpu_used_ratio{host_id="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result.length !== 0 ? res.data.result[0].values : [];
    });
  },
  getMemoryMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + `base_system:memory_used_ratio{host_id="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result.length !== 0 ? res.data.result[0].values : [];
    });
  },
  getBandwidthMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const rateFuncName = getRateFuncName(timeRange);
    const receiveUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_receive_bytes_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;
    const transmitUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_transmit_bytes_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      receive: fetch.get({
        url: receiveUrl
      }),
      transmit: fetch.get({
        url: transmitUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        receive: res.receive.data.result.length !== 0 ? res.receive.data.result[0].values : [],
        transmit: res.transmit.data.result.length !== 0 ? res.transmit.data.result[0].values : []
      };
    });
  },
  getPacketMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const rateFuncName = getRateFuncName(timeRange);
    const receiveUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_receive_packets_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;

    const transmitUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_transmit_packets_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      receive: fetch.get({
        url: receiveUrl
      }),
      transmit: fetch.get({
        url: transmitUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        receive: res.receive.data.result.length !== 0 ? res.receive.data.result[0].values : [],
        transmit: res.transmit.data.result.length !== 0 ? res.transmit.data.result[0].values : []
      };
    });
  },
  getPacketLossMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const rateFuncName = getRateFuncName(timeRange);
    const receiveUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_receive_drop_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;

    const transmitUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_transmit_drop_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;
    const reqs = {
      receive: fetch.get({
        url: receiveUrl
      }),
      transmit: fetch.get({
        url: transmitUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        receive: res.receive.data.result.length !== 0 ? res.receive.data.result[0].values : [],
        transmit: res.transmit.data.result.length !== 0 ? res.transmit.data.result[0].values : []
      };
    });
  },
  getPacketErrorMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const rateFuncName = getRateFuncName(timeRange);
    const receiveUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_receive_errs_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;
    const transmitUrl = monitorReqUrlPrefix + 'sum(' + rateFuncName +
      '(node_network_transmit_errs_total{device=~"^vlan.*$",' +
      `host_id="${id}"}[5m])) by (host_id,instance)` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      receive: fetch.get({
        url: receiveUrl
      }),
      transmit: fetch.get({
        url: transmitUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        receive: res.receive.data.result.length !== 0 ? res.receive.data.result[0].values : [],
        transmit: res.transmit.data.result.length !== 0 ? res.transmit.data.result[0].values : []
      };
    });
  }
};
