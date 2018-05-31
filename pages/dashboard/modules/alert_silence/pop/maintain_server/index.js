import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(callback) {
  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: (form, updateFields) => {
      request.getServers().then(servers => {
        updateFields({
          server: {
            data: servers
          }
        });
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      const reqData = {
        startsAt: values.maintain_time[0].format(),
        endsAt: values.maintain_time[1].format(),
        createdBy: values.creator,
        comment: values.maintain_reason,
        matchers: [{
          name: 'host_id',
          value: values.server.join('|'),
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
