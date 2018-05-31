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
      const snapshotId = data.id;
      request.flatten(snapshotId).then(() => {
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
