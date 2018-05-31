import fetch from 'client/applications/dashboard/cores/fetch';
import RSVP from 'rsvp';
import getStartAndEndTime from '../../utils/time_range';

const monitorReqUrlPrefix = '/api/monitor/query_range?query=';

const monitorQueryUrlPrefix = '/api/monitor/query?query=';

export default {
  getList: (timeRange) => {
    let cpuUrl, memeryUrl, bandwidthReadUrl, bandwidthWriteUrl, iopsReadUrl, iopsWriteUrl, id, reqs;

    return fetch.get({
      url: '/api/rgw/gateway'
    }).then(res => {
      return res.data.map(d => {
        id = d.id;
        cpuUrl = monitorQueryUrlPrefix + `node_process_cpu_used_percent{name="radosgw", host_id="${id}"}` +
        `&time=${timeRange}`;
        memeryUrl = monitorQueryUrlPrefix + `node_process_mem_used_percent{name="radosgw", host_id="${id}"}` +
        `&time=${timeRange}`;
        bandwidthReadUrl = monitorQueryUrlPrefix + `irate(node_process_io_read_bytes{name="radosgw", host_id="${id}"}[5m])` +
        `&time=${timeRange}`;
        bandwidthWriteUrl = monitorQueryUrlPrefix + `irate(node_process_io_write_bytes{name="radosgw", host_id="${id}"}[5m])` +
        `&time=${timeRange}`;
        iopsReadUrl = monitorQueryUrlPrefix + `irate(node_process_io_read_count{name="radosgw",host_id="${id}"}[5m])` +
        `&time=${timeRange}`;
        iopsWriteUrl = monitorQueryUrlPrefix + `irate(node_process_io_write_count{name="radosgw",host_id="${id}"}[5m])` +
        `&time=${timeRange}`;

        reqs = {
          readIops: fetch.get({
            url: iopsReadUrl
          }),
          writeIops: fetch.get({
            url: iopsWriteUrl
          }),
          cpu: fetch.get({
            url: cpuUrl
          }),
          memery: fetch.get({
            url: memeryUrl
          }),
          bandwidthRead: fetch.get({
            url: bandwidthReadUrl
          }),
          bandwidthWrite: fetch.get({
            url: bandwidthWriteUrl
          })
        };

        return RSVP.hash(reqs).then(res => {
          ['readIops', 'writeIops', 'cpu', 'memery', 'bandwidthRead', 'bandwidthWrite'].forEach(m => {
            d[m] = res[m].data.result[0] ? res[m].data.result[0].value[1] : 0;
          });

          return d;
        });
      });
    });
  },
  getSingle: (id, timeRange) => {
    let cpuUrl, memeryUrl, bandwidthReadUrl, bandwidthWriteUrl, iopsReadUrl, iopsWriteUrl, reqs;

    return fetch.get({
      url: '/api/rgw/gateway/' + id
    }).then(res => {
      cpuUrl = monitorQueryUrlPrefix + `node_process_cpu_used_percent{name="radosgw", host_id="${id}"}` +
      `&time=${timeRange}`;
      memeryUrl = monitorQueryUrlPrefix + `node_process_mem_used_percent{name="radosgw", host_id="${id}"}` +
      `&time=${timeRange}`;
      bandwidthReadUrl = monitorQueryUrlPrefix + `irate(node_process_io_read_bytes{name="radosgw", host_id="${id}"}[5m])` +
      `&time=${timeRange}`;
      bandwidthWriteUrl = monitorQueryUrlPrefix + `irate(node_process_io_write_bytes{name="radosgw", host_id="${id}"}[5m])` +
      `&time=${timeRange}`;
      iopsReadUrl = monitorQueryUrlPrefix + `irate(node_process_io_read_count{name="radosgw",host_id="${id}"}[5m])` +
      `&time=${timeRange}`;
      iopsWriteUrl = monitorQueryUrlPrefix + `irate(node_process_io_write_count{name="radosgw",host_id="${id}"}[5m])` +
      `&time=${timeRange}`;

      reqs = {
        readIops: fetch.get({
          url: iopsReadUrl
        }),
        writeIops: fetch.get({
          url: iopsWriteUrl
        }),
        cpu: fetch.get({
          url: cpuUrl
        }),
        memery: fetch.get({
          url: memeryUrl
        }),
        bandwidthRead: fetch.get({
          url: bandwidthReadUrl
        }),
        bandwidthWrite: fetch.get({
          url: bandwidthWriteUrl
        })
      };

      return RSVP.hash(reqs).then(r => {
        ['readIops', 'writeIops', 'cpu', 'memery', 'bandwidthRead', 'bandwidthWrite'].forEach(m => {
          res[m] = r[m].data.result[0] ? r[m].data.result[0].value[1] : 0;
        });

        return res;
      });
    });
  },
  getCpuMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + `node_process_cpu_used_percent{name="radosgw", host_id="${id}"}` +
    `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0].values;
    });
  },
  getIopsMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const iopsReadUrl = monitorReqUrlPrefix + `sum(irate(node_process_io_read_count{name="radosgw", host_id="${id}"}[5m]))` +
      `&start=${start}&end=${end}&step=${step}`;
    const iopsWritedUrl = monitorReqUrlPrefix + `sum(irate(node_process_io_write_count{name="radosgw", host_id="${id}"}[5m]))` +
      `&start=${start}&end=${end}&step=${step}`;

    const reqs = {
      read_iops: fetch.get({
        url: iopsReadUrl
      }),
      write_iops: fetch.get({
        url: iopsWritedUrl
      })
    };

    return RSVP.hash(reqs).then(res => {
      let data = {};
      ['read_iops', 'write_iops'].forEach(m => {
        data[m] = res[m].data.result[0] ? res[m].data.result[0].values : [[start, 0], [end, 0]];
      });

      return data;
    });
  },
  getBandwidthMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const bandwidthReadUrl = monitorReqUrlPrefix + `sum(irate(node_process_io_read_bytes{name="radosgw", host_id="${id}"}[5m]))` +
      `&start=${start}&end=${end}&step=${step}`;
    const bandwidthWritedUrl = monitorReqUrlPrefix + `sum(irate(node_process_io_write_bytes{name="radosgw", host_id="${id}"}[5m]))` +
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
  getMemeryMonitorData: (id, timeRange) => {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const url = monitorReqUrlPrefix + `node_process_mem_used_percent{name="radosgw", host_id="${id}"}` +
      `&start=${start}&end=${end}&step=${step}`;

    return fetch.get({
      url: url
    }).then(res => {
      return res.data.result[0] ? res.data.result[0].values : [[start, 0], [end, 0]];
    });
  }
};

