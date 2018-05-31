import {ModalV2} from 'ufec';
import config from './config.js';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(obj, data, callback) {
  let props = {
    __: __,
    config: config,
    modalClassName: 'modify-policy',
    onInitialize: function(form, updateFields) {
      request.getAllList().then(res => {
        const defaultpolicy = res.data.filter(item => {
          return item.default && item.default === true;
        });
        updateFields({
          default_data_policy: {
            data: res.data,
            nameType: 'id',
            hide: false
          }
        });
        form.setFields({
          default_data_policy: {
            value: defaultpolicy && defaultpolicy[0].id
          }
        });
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      let defaultValue = values.default_data_policy;
      request.setDefault(defaultValue).then(() => {
        callback && callback();
        cb(true);
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    }
  };
  ModalV2(props);
}
export default pop;
