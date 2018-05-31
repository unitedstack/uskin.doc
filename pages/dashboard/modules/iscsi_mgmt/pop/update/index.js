import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(data, callback) {
  const chap = data.auth && data.auth.chap;
  let userName = '',
    password = '';

  if(chap) {
    userName = chap.split('/')[0];
    password = chap.split('/')[1];
  }

  let props = {
    __: __,
    config: config,
    onInitialize: function(form) {
      form.setFields({
        user_name: {
          value: userName
        },
        password: {
          value: password
        }
      });
    },
    onConfirm: function(values, cb) {
      const iqn = data.wwn;
      const reqData = {};

      // @TODO 注意目前在修改时后端好像不允许将用户名和密码字段都删掉，与创建时不同
      reqData.username = values.user_name;
      reqData.password = values.password;

      request.updateClient(iqn, reqData).then(() => {
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
