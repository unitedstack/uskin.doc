require('./style/index.less');

import {ModalV2} from 'ufec';
import config from './config.js';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(obj, data, callback) {
  config.fields[0].text = obj.id;
  let props = {
    __: __,
    config: config,
    modalClassName: 'modify-policy',
    onInitialize: function(form, updateFields) {
      form.setFields({
        associated_pool: {
          value: obj.data_pool === 'undefined' ? '' : obj.data_pool
        },

        select_zip: {
          data: [{'id': 'zlib', 'name': 'zlib'}],
          nameType: 'select_zip',
          value: 'zlib'
        },

        yorn_zip: {
          value: obj.compression && obj.compression !== '' ? ['yorn_zip'] : []
        },

        yorn_index: {
          value: obj.index_type === 0 ? ['yorn_index'] : []
        }
      });

      request.getPoolList().then(res => {
        const rgwData = res.data.filter(item => {
          return item.application_metadata && item.application_metadata.rgw && item.application_metadata.rgw.type !== 'metadata';
        });

        updateFields({
          associated_pool: {
            data: rgwData,
            hide: false,
            nameType: 'pool_name',
            value: obj.data_pool
          },
          select_zip: {
            hide: obj.compression && obj.compression !== '' ? false : true
          }
        });
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      const data = {
        name: obj.id,
        data_pool: values.associated_pool,
        index_type: values.yorn_index && values.yorn_index.length > 0 ? 0 : 1,
        compression: values.yorn_zip && values.yorn_zip.length > 0 ? values.select_zip : ''
      };

      request.modifyPolicy(data).then((res) => {
        callback && callback(res);
        cb(true);
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    }
  };
  ModalV2(props);
}
export default pop;
