import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';


function normalizeList(disks) {
  const diskList = disks.map(disk => {
    return {
      id: disk.id,
      // 暂时加上存储池的信息方便测试
      name: disk.name + ' (' + __.pool + ': ' + disk.pool + ')',
      suggestAssociating: disk.clients.length === 0 ? true : false
    };
  });

  return diskList;
}

function pop(data, callback) {
  // 已关联的卷
  const associatedVolumeIdList = data.disks.map((disk) => {
    return disk.id;
  });

  let props = {
    __: __,
    config: config,
    onInitialize: function(form, updateFields) {
      request.getVolumes().then(disks => {
        form.setFields({
          volumes: {
            value: associatedVolumeIdList
          }
        });
        const diskList = normalizeList(disks);
        updateFields({
          volumes: {
            data: diskList
          }
        });
      });
    },
    onConfirm: function(values, cb) {
      const iqnName = data.wwn;
      const diskIdList = values.volumes || [];

      request.associateVolumes(iqnName, diskIdList).then(() => {
        cb(true);
        callback && callback();
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    }
  };

  ModalV2(props);
}

export default pop;
