require('./style/index.less');

import {ModalV2} from 'ufec';
import config from './config.js';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(obj, data, callback) {
  let props = {
    __: __,
    config: config,
    modalClassName: 'create-policy',
    onInitialize: function(form, updateFields) {
      request.getPoolList().then(res => {
        const rgwData = res.data.filter(item => {
          return item.application_metadata && item.application_metadata.rgw && item.application_metadata.rgw.type !== 'metadata';
        });
        updateFields({
          associated_pool: {
            data: rgwData,
            hide: false,
            nameType: 'pool_name'
          }
        });
        form.setFields({
          associated_pool: {
            value: rgwData[0] && rgwData[0].pool_name
          },
          select_zip: {
            value: 'zlib'
          }
        });
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      let data = {
        name: values.name,
        data_pool: values.associated_pool,
        index_type: values.yorn_index && values.yorn_index.length > 0 ? 0 : 1
      };

      if(values.yorn_zip && values.yorn_zip.length > 0) {
        data.compression = values.select_zip;
      }

      request.createPolicy(data).then((res) => {
        if(values.yorn_default && values.yorn_default.length > 0) {
          request.setDefault(data.name).then(() => {
            callback && callback();
            cb(true);
          }).catch(err => {
            cb(false, getErrorMessage(err));
          });
        } else {
          callback && callback();
          cb(true);
        }
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    },
    onAction: function(field, value, form, updateFields) {
      const valueZip = form.getFieldValue('yorn_zip');
      switch (field) {
        case 'option':
          updateFields({
            select_zip: {
              hide: !(value && value.length > 0 && valueZip && valueZip.length > 0)
            }
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
