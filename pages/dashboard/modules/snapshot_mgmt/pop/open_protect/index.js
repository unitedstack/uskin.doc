import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(data, parent, callback) {
  let props = {
    __: __,
    parent: parent,
    config: config,
    onConfirm: function(values, cb) {
      let snapshotId;
      if(data.snapData) {
        // 从克隆 pop 处弹出
        snapshotId = data.snapData.id;
      } else {
        snapshotId = data.id;
      }

      request.openProtection(snapshotId).then(() => {
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
