import {ModalV2} from 'ufec';
import config from './config';

function pop(obj, callback) {

  let props = {
    config: config,
    onConfirm: function(values, cb, closeImmediately) {
      request.modifyPassword({
        old_password: values.old_password,
        new_password: values.new_password
      }).then(res => {
        cb(true);
        window.location = '/logout';
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    }
  };
  ModalV2(props);
}
export default pop;
