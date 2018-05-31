import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(data, callback) {
  let props = {
    __: __,
    config: config,
    onInitialize: (form) => {
      // 强行给个初始值，不然下面的字段可能会自动补全
      form.setFields({
        iqn: {
          value: 'iqn'
        }
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      const reqData = {
        iqn: values.iqn
      };

      if(values.bidirectional_chap) {
        reqData.username = values.user_name;
        reqData.password = values.password;
      }

      request.createClient(reqData).then(() => {
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
