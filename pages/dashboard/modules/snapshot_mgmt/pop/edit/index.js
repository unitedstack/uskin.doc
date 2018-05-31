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
    onInitialize: function(form) {
      form.setFields({
        snapshot_name: {
          value: data.snapshot
        }
      });
    },
    onConfirm: function(values, cb) {
      const snapshotId = data.id;
      const newName = values.snapshot_name;
      request.editSnapshotName(snapshotId, newName).then(() => {
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
