import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(data, callback) {
  let props = {
    __: __,
    config: config,
    onInitialize: function(form, updateFields) {
      updateFields({
        disassocate_tip: {
          message: __[config.fields[0].message].replace(/\{0\}/, data.iqnName)
        }
      });
    },
    onConfirm: function(values, cb) {
      const iqn = data.iqnName;
      const disAssociateDiskId = data.diskId;
      const diskIdList = [];

      data.disks.forEach(disk => {
        if(disk.id !== disAssociateDiskId) {
          diskIdList.push(disk.id);
        }
      });

      request.disassociateVolume(iqn, diskIdList).then(() => {
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
