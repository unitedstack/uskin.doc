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
    onInitialize: (form) => {
    },
    onConfirm: function(values, cb) {
      const reqData = {
        startsAt: values.maintain_time[0].format(),
        endsAt: values.maintain_time[1].format(),
        createdBy: values.creator,
        comment: values.maintain_reason,
        matchers: [{
          name: 'job',
          value: '.*',
          isRegex: true
        }]
      };

      request.createAlertSilence(reqData).then(() => {
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
