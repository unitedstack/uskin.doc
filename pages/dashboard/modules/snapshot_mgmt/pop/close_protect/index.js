import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import popUnlink from '../unlink/index';
import getErrorMessage from '../../../../utils/error_message';

function pop(data, parent, callback) {
  let hasCloneVolume = data.child.length === 0 ? false : true;

  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(form, updateFields) {
      updateFields({
        sure_close: {
          hide: hasCloneVolume
        },
        close_tip: {
          hide: !hasCloneVolume
        }
      });
    },
    onConfirm: function(values, cb) {
      const snapshotId = data.id;
      request.closeProtection(snapshotId).then(() => {
        cb(true);
        callback && callback();
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    },
    onAction: function(field, value, form, updateFields) {
      switch (field) {
        case 'close_tip':
          popUnlink(data, modalRefList[modalRefList.length - 1], () => {
            // 成功断链，修改状态，以便正确设置按钮状态
            hasCloneVolume = false;
            updateFields({
              sure_close: {
                hide: false
              },
              close_tip: {
                hide: true
              }
            });
          });
          break;
        default:
          break;
      }
    }
  };

  ModalV2(props);
}

export default pop;
