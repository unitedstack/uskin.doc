import fetch from '../../cores/fetch';
import RSVP, { Promise } from 'rsvp';
import getStartAndEndTime from '../../utils/time_range';

const urlPrefix = '/api/monitor/query?query=';

export default {
  getInstantIOData: function() {
    const reqs = {
      read_iops: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_read_op_per_second'
      }),
      write_iops: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_write_op_per_second'
      }),
      recovery_iops: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_recovering_op_per_second'
      }),
      read_bandwidth: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_read_bytes_per_second'
      }),
      write_bandwidth: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_write_bytes_per_second'
      }),
      recovery_bandwidth: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_recovering_op_per_second'
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        read_iops: res.read_iops.data.result.length !== 0 ? res.read_iops.data.result[0].value[1] : 0,
        write_iops: res.write_iops.data.result.length !== 0 ? res.write_iops.data.result[0].value[1] : 0,
        recovery_iops: res.recovery_iops.data.result.length !== 0 ? res.recovery_iops.data.result[0].value[1] : 0,
        read_bandwidth: res.read_bandwidth.data.result.length !== 0 ? res.read_bandwidth.data.result[0].value[1] : 0,
        write_bandwidth: res.write_bandwidth.data.result.length !== 0 ? res.write_bandwidth.data.result[0].value[1] : 0,
        recovery_bandwidth: res.recovery_bandwidth.data.result.length !== 0 ? res.recovery_bandwidth.data.result[0].value[1] : 0
      };
    }).then(res => {
      const byteToMB = 1024 * 1024;
      return {
        ...res,
        read_bandwidth: (res.read_bandwidth / byteToMB).toFixed(1),
        write_bandwidth: (res.write_bandwidth / byteToMB).toFixed(1),
        recovery_bandwidth: (res.recovery_bandwidth / byteToMB).toFixed(1)
      };
    });
  },
  getIOPSData: function(timeRange) {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const urlPrefix = `/api/monitor/query_range?start=${start}&end=${end}&step=${step}&query=`;

    const reqs = {
      read: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_read_op_per_second'
      }),
      write: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_write_op_per_second'
      }),
      recovery: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_recovering_op_per_second'
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        read: res.read.data.result.length !== 0 ? res.read.data.result[0].values : [],
        write: res.write.data.result.length !== 0 ? res.write.data.result[0].values : [],
        recovery: res.recovery.data.result.length !== 0 ?
        res.recovery.data.result[0].values : []
      };
    });
  },
  getBandwidthData: function(timeRange) {
    const { start, end, step } = getStartAndEndTime(timeRange);
    const urlPrefix = `/api/monitor/query_range?start=${start}&end=${end}&step=${step}&query=`;

    const reqs = {
      read: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_read_bytes_per_second'
      }),
      write: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_client_write_bytes_per_second'
      }),
      recovery: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_recovering_bytes_per_second'
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        read: res.read.data.result.length !== 0 ? res.read.data.result[0].values : [],
        write: res.write.data.result.length !== 0 ? res.write.data.result[0].values : [],
        recovery: res.recovery.data.result.length !== 0 ?
        res.recovery.data.result[0].values : []
      };
    });
  },
  getClusterDataStatusData: function() {
    const reqs = {
      healthy: fetch.get({
        url: urlPrefix + 'uds_ceph_pgs_healthy'
      }),
      degraded: fetch.get({
        url: urlPrefix + 'uds_ceph_pgs_degraded'
      }),
      wait_recovery: fetch.get({
        url: urlPrefix + 'uds_ceph_pgs_recovery_wait'
      }),
      unavailable: fetch.get({
        url: urlPrefix + 'uds_ceph_pgs_unusable'
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        healthy: Number(res.healthy.data.result.length !== 0 ? res.healthy.data.result[0].value[1] : 0),
        degraded: Number(res.degraded.data.result.length !== 0 ? res.degraded.data.result[0].value[1] : 0),
        wait_recovery: Number(res.wait_recovery.data.result.length !== 0 ? res.wait_recovery.data.result[0].value[1] : 0),
        unavailable: Number(res.unavailable.data.result.length !== 0 ? res.unavailable.data.result[0].value[1] : 0)
      };
    }).then(res => {
      return {
        total: res.healthy + res.degraded + res.wait_recovery + res.unavailable,
        healthy: res.healthy,
        degraded: res.degraded,
        wait_recovery: res.wait_recovery,
        unavailable: res.unavailable
      };
    });
  },
  getClusterCapacityData: function() {
    const reqs = {
      total: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_total_bytes'
      }),
      unused: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_total_avail_bytes'
      }),
      used: fetch.get({
        url: urlPrefix + 'uds_ceph_cluster_total_used_bytes'
      })
    };

    return RSVP.hash(reqs).then(res => {
      return {
        total: res.total.data.result.length !== 0 ? res.total.data.result[0].value[1] : 0,
        unused: res.unused.data.result.length !== 0 ? res.unused.data.result[0].value[1] : 0,
        used: res.used.data.result.length !== 0 ? res.used.data.result[0].value[1] : 0
      };
    }).then(res => {
      const tbToB = 1024 * 1024 * 1024 * 1024;
      return {
        total: Math.round(res.total / tbToB),
        used: Math.round(res.used / tbToB),
        unused: Math.round(res.unused / tbToB)
      };
    });
  },
  getServiceStatusData: function() {
    const reqs = {
      monAva: fetch.get({
        url: urlPrefix + 'uds_ceph_mon_quorum_count'
      }),
      monUnava: fetch.get({
        url: urlPrefix + 'count_values("uds_ceph_mon_quorum_status",uds_ceph_mon_quorum_status==0)'
      }),
      osdAva: fetch.get({
        url: urlPrefix + 'uds_ceph_osds_up'
      }),
      osdUnava: fetch.get({
        url: urlPrefix + 'uds_ceph_osds_down'
      }),
      mgrAva: fetch.get({
        url: urlPrefix + 'uds_ceph_mgrs_up'
      }),
      mgrUnava: fetch.get({
        url: urlPrefix + 'uds_ceph_mgrs_down'
      }),
      // mds 暂无
      mdsAva: Promise.resolve(0),
      mdsUnava: Promise.resolve(0)
    };

    return RSVP.hash(reqs).then(res => {
      return {
        mon: {
          available: res.monAva.data.result.length !== 0 ? res.monAva.data.result[0].value[1] : 0,
          unavailable: res.monUnava.data.result.length !== 0 ? res.monUnava.data.result[0].value[1] : 0
        },
        osd: {
          available: res.osdAva.data.result.length !== 0 ? res.osdAva.data.result[0].value[1] : 0,
          unavailable: res.osdUnava.data.result.length !== 0 ? res.osdUnava.data.result[0].value[1] : 0
        },
        mgr: {
          available: res.mgrAva.data.result.length !== 0 ? res.mgrAva.data.result[0].value[1] : 0,
          unavailable: res.mgrUnava.data.result.length !== 0 ? res.mgrUnava.data.result[0].value[1] : 0
        },
        mds: {
          available: res.mdsAva,
          unavailable: res.mdsUnava
        }
      };
    });
  },
  getServerStatus: function() {
    const reqs = {
      total: fetch.get({
        url: urlPrefix + 'count(node_ipmi_sensor_status)'
      }),
      alarmed: fetch.get({
        url: urlPrefix + 'count(node_ipmi_sensor_status == 1)'
      }),
      wrong: fetch.get({
        url: urlPrefix + 'count(node_ipmi_sensor_status == 2)'
      })
    };

    return RSVP.hash(reqs).then(res => {
      const total = res.total.data.result.length !== 0 ? res.total.data.result[0].value[1] : 0;
      const alarmed = res.alarmed.data.result.length !== 0 ? res.alarmed.data.result[0].value[1] : 0;
      const wrong = res.wrong.data.result.length !== 0 ? res.wrong.data.result[0].value[1] : 0;

      const healthy = total - alarmed - wrong;

      return {
        total, healthy, alarmed, wrong
      };
    });
  },
  getDiskStatus: function() {
    const reqs = {
      total: fetch.get({
        url: urlPrefix + 'sum(base_system:physical_disk_total_count)'
      }),
      healthy: fetch.get({
        url: urlPrefix + 'count_values("node_disk_smart_health_status",node_disk_smart_health_status{wwn!="null"}!=0)'
      }),
      alarmed: fetch.get({
        url: urlPrefix + 'count_values("node_disk_smart_health_status",node_disk_smart_health_status{wwn!="null"}==0)'
      }),
      // 应接口要求，一直置0
      wrong: Promise.resolve(0)
    };

    return RSVP.hash(reqs).then(res => {
      return {
        total: res.total.data.result.length !== 0 ? res.total.data.result[0].value[1] : 0,
        healthy: res.healthy.data.result.length !== 0 ? res.healthy.data.result[0].value[1] : 0,
        alarmed: res.alarmed.data.result.length !== 0 ? res.alarmed.data.result[0].value[1] : 0,
        wrong: res.wrong
      };
    });
  },
  getAlertData: function() {
    // 这个 API 比较特殊，和其他的不一样
    return fetch.get({
      url: '/api/alerta/alert/count'
    }).then(res => {
      return {
        information: res.severityCounts.informational !== undefined ? res.severityCounts.informational : 0,
        warning: res.severityCounts.warning !== undefined ? res.severityCounts.warning : 0,
        serious: res.severityCounts.major !== undefined ? res.severityCounts.major : 0,
        disaster: res.severityCounts.critical !== undefined ? res.severityCounts.critical : 0
      };
    }).then(res => {
      return {
        total: res.information + res.warning + res.serious + res.disaster,
        ...res
      };
    });
  },
  getRbdCount: function() {
    return fetch.get({
      url: '/api/overview/rbd'
    }).then(res => {
      return {
        volume: res.image,
        snapshot: res.snap,
        // -1 值代表 iscsi 未初始化
        iscsi: res.iscsi === undefined ? -1 : res.iscsi,
      };
    });
  },
  getRgwCount: function() {
    return fetch.get({
      url: '/api/overview/rgw'
    }).then(res => {
      return {
        bucket: res.bucket,
        s3: res.s3,
        policy: res.placement
      };
    });
  }
};
