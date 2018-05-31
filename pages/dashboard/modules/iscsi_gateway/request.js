import fetch from '../../cores/fetch';
import config from './config.json';
import RSVP from 'rsvp';
import getStartAndEndTime from '../../utils/time_range';
const limit = config.table.limit;

const monitorReqUrlPrefix = '/api/monitor/query_range?query=';

export default {
  getList: function(page) {
    const p = page ? page : 1;
    const url = `/api/iscsi/gateway?page=${p}&limit=${limit}`;
    return fetch.get({
      url
    }).then(res => {
      const reqs = res.data.map(isc => {
        return this.getStatus(isc.uuid);
      });

      return RSVP.all(reqs).then(resList => {
        return resList.map((item, index) => {
          return {
            ...res.data[index],
            state: item
          };
        });
      });
    });
  },
  getStatus: function(id) {
    const url = '/api/monitor/query?query=node_systemd_unit_state' +
      `{name="rbd-target-gw.service",state="active",host_id="${id}"}`;
    return fetch.get({
      url: url
    }).then(res => {
      const state = res.data.result.length !== 0 ? Number(res.data.result[0].value[1]) : 0;
      return state === 1 ? 'active' : 'inactive';
    });
  },
  getCPUAndMemoryData: function(id) {
    const reqs = {
      cpu: fetch.get({
        url: `/api/monitor/query?query=node_process_cpu_used_percent{name="tcmu-runner",host_id="${id}"}`
      }),
      memory: fetch.get({
        url: `/api/monitor/query?query=node_process_mem_used_percent{name="tcmu-runner",host_id="${id}"}`
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        cpu: res.cpu.data.result.length !== 0 ? res.cpu.data.result[0].value[1] : 0,
        memory: res.memory.data.result.length !== 0 ? res.memory.data.result[0].value[1] : 0
      };
    });
  },
  getMemoryMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'node_process_mem_used_percent' +
     `{name="tcmu-runner",host_id="${id}"}` + `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result.length !== 0 ? res.data.result[0].values : [];
    });
  },
  getCPUMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'node_process_cpu_used_percent' +
     `{name="tcmu-runner",host_id="${id}"}` + `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result.length !== 0 ? res.data.result[0].values : [];
    });
  },
  getReceivedFlowMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'irate(node_process_io_write_bytes' +
     `{name="tcmu-runner",host_id="${id}"}[5m])` + `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result.length !== 0 ? res.data.result[0].values : [];
    });
  },
  getTransmitFlowMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + 'irate(node_process_io_read_bytes' +
     `{name="tcmu-runner",host_id="${id}"}[5m])` + `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result.length !== 0 ? res.data.result[0].values : [];
    });
  }
};