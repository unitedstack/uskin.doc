import './style/index.less';

import {ModalV2} from 'ufec';
import config from './config.js';
import  __ from 'client/locale/dashboard.lang.json';
import request from '../../request';

function pop(obj, callback) {
  config.fields[0].decorator.initialValue = obj.email;
  config.fields[1].decorator.initialValue = obj.system === 'true' ? ['system_user'] : [];

  let props = {
    __: __,
    config: config,
    onConfirm: function(values, cb, closeImmediately) {
      let data = {
        uid: obj.user_id,
        email: values.email
      };
      data['system'] = values.system_user && values.system_user.length > 0 ? true : false;
      request.updateUser(data).then((res)=> {
        callback && callback(res);
        cb(true);
      }).catch(error => {
        cb(false);
      });
    }
  };

  ModalV2(props);
}

export default pop;
