import fetch from '../../cores/fetch';
import config from './config.json';
const limit = config.table.limit;

export default {
  getList: function(pool, pageNumber) {
    const p = pageNumber ? pageNumber : 1;
    const url = `/api/rbd/snap?pool=${pool}&page=${p}&limit=${limit}`;

    return fetch.get({
      url
    });
  },
  getSingleById: function(snapshotId) {
    const url = `/api/rbd/snap/${snapshotId}`;
    return fetch.get({
      url
    });
  },
  getPoolList: function(type) {
    return fetch.get({
      url: `/api/pool?limit=0&type=${type}`
    });
  },
  createCloneVolume: function(snapshotId, volumeData) {
    const url = `/api/rbd/snap/${snapshotId}/image`;

    return fetch.post({
      url,
      data: volumeData
    });
  },
  openProtection: function(snapshotId) {
    const url = `/api/rbd/snap/${snapshotId}/protect`;

    return fetch.put({
      url
    });
  },
  closeProtection: function(snapshotId) {
    const url = `/api/rbd/snap/${snapshotId}/unprotect`;

    return fetch.put({
      url
    });
  },
  flatten: function(snapshotId) {
    const url = `/api/rbd/snap/${snapshotId}/flatten`;

    return fetch.post({
      url
    });
  },
  singleFlatten: function(imageId) {
    const url = `/api/rbd/image/${imageId}/flatten`;

    return fetch.post({
      url
    });
  },
  editSnapshotName: function(snapshotId, newName) {
    const url = `/api/rbd/snap/${snapshotId}/name`;
    const data = {
      snap: newName
    };

    return fetch.put({
      url, data
    });
  },
  delete: function(snapshotId) {
    const url = `/api/rbd/snap/${snapshotId}`;

    return fetch.delete({
      url
    });
  }
};