import fetch from 'client/applications/dashboard/cores/fetch';
import config from './config.json';

import getStartAndEndTime from '../../utils/time_range';
import RSVP from 'rsvp';

const limit = config.table.limit;

const monitorRangeReqUrlPrefix = '/api/monitor/query_range?query=';


function singleLineTimeRange(supply){
  return (
    function(wwn, timeRange){
      const { start, end, step } = getStartAndEndTime(timeRange);
      const url = monitorRangeReqUrlPrefix + supply + `{wwn="${wwn}"}` +
      `&start=${start}&end=${end}&step=${step}`;

      return fetch.get({
        url: url
      }).then(res => {
        return res.data.result.length == 0 ? [[start, 0], [end, 0]] : (res.data.result[0].values ? res.data.result[0].values : res.data.result[0].value);
      });
    }
  );
}

function doubleLineTimeRange(readSupply, writeSupply, supply){
  return(
    function(wwn, timeRange){
      const { start, end, step } = getStartAndEndTime(timeRange);
      const readUrl = monitorRangeReqUrlPrefix + readSupply + `{wwn="${wwn}"}` + supply +
      `&start=${start}&end=${end}&step=${step}`;
      const writeUrl = monitorRangeReqUrlPrefix + writeSupply + `{wwn="${wwn}"}` + supply +
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
          read: res.read.data.result.length == 0 ? [[start, 0], [end, 0]] : res.read.data.result[0].values,
          write: res.write.data.result.length == 0 ? [[start, 0], [end, 0]] : res.write.data.result[0].values
        };
      });
    }
  );
}

const api = {
  'iops': 'node_disk_io_now',
  'bw-read': 'irate(node_disk_read_bytes_total',
  'bw-write': 'irate(node_disk_written_bytes_total',
  'bw-supply': '[5m])',
  'wait-read': 'node_disk_io_r_await',
  'wait-write': 'node_disk_io_w_await',
  'service': 'node_disk_io_svctm',
  'rate': 'node_disk_io_util'
};

export default {
  getList: (page) => {
    let p = page ? page : 1;
    return fetch.get({
      url: `/api/openstack/disks?page=${p}&limit=${limit}`
    });
  },
  getListById: (id) => {
    return fetch.get({
      url: `/api/openstack/disk/${id}`
    });
  },
  getSmart: (id) => {
    return fetch.get({
      url: `/api/openstack/disk/smart/${id}`
    });
  },
  getIOPSMonitorData: singleLineTimeRange(api['iops']),
  getBandwidthMonitorData: doubleLineTimeRange(api['bw-read'], api['bw-write'], api['bw-supply']),
  getIOWaitMonitorData: doubleLineTimeRange(api['wait-read'], api['wait-write'], ''),
  getIOServiceMonitorData: singleLineTimeRange(api['service']),
  getIORateMonitorData: singleLineTimeRange(api['rate'])
};
