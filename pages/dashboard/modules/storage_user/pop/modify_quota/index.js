import './style/index.less';
import {ModalV2} from 'ufec';
import config from './config.js';
import  __ from 'client/locale/dashboard.lang.json';
import getErrorMessage from '../../../../utils/error_message';
import request from '../../request';

function pop(obj, parent, callback) {
  config.fields[0].decorator.initialValue = obj.max_buckets;
  config.fields[2].decorator.initialValue = obj.user_quota.max_size_kb / 1024 / 1024;
  config.fields[3].decorator.initialValue = obj.user_quota.max_objects;
  config.fields[5].decorator.initialValue = obj.bucket_quota.max_size_kb / 1024 / 1024;
  config.fields[6].decorator.initialValue = obj.bucket_quota.max_objects;
  config.fields[1].decorator.initialValue = obj.user_quota.enabled === true ? ['enable'] : [];
  config.fields[4].decorator.initialValue = obj.bucket_quota.enabled === true ? ['enable'] : [];

  let props = {
    __: __,
    parent: parent,
    config: config,
    modalClassName: 'modify-quota',
    onInitialize: function(form, updateFields) {
      updateFields({
        capacity_qutoa: {
          disabled: obj.user_quota.enabled ? false : true
        },
        objects_qutoa: {
          disabled: obj.user_quota.enabled ? false : true
        },
        bucket_capacity: {
          disabled: obj.bucket_quota.enabled ? false : true
        },
        object_capacity: {
          disabled: obj.bucket_quota.enabled ? false : true
        }
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      const enableValue = values.enable,
        bucketQutoa = values.bucket_qutoa,
        capacityQutoa = values.capacity_qutoa,
        objectsQutoa = values.objects_qutoa,
        bucketEnableValue = values.enable_defaultQuota,
        bucketCapacity = values.bucket_capacity,
        objectCapacity = values.object_capacity;

      let updateUserData = {
        'uid': obj.id
      };

      updateUserData['max-buckets'] = parseInt(bucketQutoa, 10);
      updateUserData['email'] = obj.email;

      request.updateUser(updateUserData).then(() => {
        let userQuotaData = {
          'uid': obj.id,
          'max-objects': parseInt(objectsQutoa, 10) || -1,
          'max-size-kb': capacityQutoa * 1024 * 1024 || 0,
          'enabled': enableValue && enableValue.length > 0,
        };

        let bucketQuotaData = {
          'uid': obj.id,
          'max-objects': parseInt(objectCapacity, 10) || -1,
          'max-size-kb': bucketCapacity * 1024 * 1024 || 0,
          'enabled': bucketEnableValue && bucketEnableValue.length > 0
        };

        request.createUserQuota(userQuotaData).then((res) => {
          request.createBucketQuota(bucketQuotaData).then((res) => {
            cb(true);
            callback && callback();
          }).catch((err) => {
            cb(false, getErrorMessage(err));
          });
        }).catch((err) => {
          cb(false, getErrorMessage(err));
        });
      }).catch((err) => {
        cb(false, getErrorMessage(err));
      });
    },
    onAction: function(field, value, form, updateFields) {
      let enable, bucketEnable;
      switch(field) {
        case 'enable':
          enable = value && value.length > 0;
          updateFields({
            capacity_qutoa: {
              disabled: !enable
            },
            objects_qutoa: {
              disabled: !enable
            }
          });
          break;
        case 'enable_defaultQuota':
          bucketEnable = value && value.length > 0;
          updateFields({
            bucket_capacity: {
              disabled: !bucketEnable
            },
            object_capacity: {
              disabled: !bucketEnable
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
