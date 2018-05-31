import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import popCloseProtect from '../close_protect/index';
import getErrorMessage from '../../../../utils/error_message';

function pop(data, parent, callback) {
  let isProtected = data.protected === 'true' ? true : false;

  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(form, updateFields) {
      updateFields({
        close_tip: {
          hide: !isProtected
        },
        delete_text: {
          hide: isProtected
        }
      });
    },
    onConfirm: function(values, cb) {
      const snapshotId = data.id;
      request.delete(snapshotId).then(() => {
        cb(true);
        callback && callback();
      }).catch((err) => {
        cb(false, getErrorMessage(err));
      });
    },
    onAction: function(field, value, form, updateFields) {
      switch(field) {
        case 'close_tip':
          popCloseProtect(data, modalRefList[modalRefList.length - 1], () => {
            isProtected = false;
            updateFields({
              close_tip: {
                hide: true
              },
              delete_text: {
                hide: false
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

