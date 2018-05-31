import {ModalV2} from 'ufec';
import config from './config';
import  __ from 'client/locale/dashboard.lang.json';

import getErrorMessage from '../../../../utils/error_message';

import request from '../../request';

function pop(obj, parent, callback) {
  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(form, updateFields) {
      if(obj.bucket_quota.enabled) {
        form.setFields({
          enable: {
            value: ['enable']
          }
        });
      }

      updateFields({
        bucket_capacity: {
          disabled: !obj.bucket_quota.enabled
        },
        object_capacity: {
          disabled: !obj.bucket_quota.enabled
        }
      });

      form.setFields({
        bucket_capacity: {
          value: obj.bucket_quota.max_size_kb / 1024 / 1024
        },
        object_capacity: {
          value: obj.bucket_quota.max_objects
        }
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      const enableValue = values.enable,
        bucketCapacity = values.bucket_capacity,
        objectCapacity = values.object_capacity,
        enable = enableValue && enableValue.length > 0,
        singleQuota = {};

      // (初始化关闭配额 && 开启配额)
      if (!obj.bucket_quota.enabled && enable) {
        request.enableBucketQuota(obj.bucket).then(enableRes => {
          singleQuota.bucket = obj.bucket;
          singleQuota['max-size'] = bucketCapacity * 1024 * 1024;
          singleQuota['max-objects'] = objectCapacity;
          request.updateBucketQuota(singleQuota).then(quotaRes => {
            cb(true);
            callback && callback();
          }).catch(error => cb(false, getErrorMessage(error)));
        }).catch(error => cb(false, getErrorMessage(error)));
      } else if (obj.bucket_quota.enabled && enable) { // (初始化开启配额 && 开启配额)
        singleQuota.bucket = obj.bucket;
        singleQuota['max-size'] = bucketCapacity * 1024 * 1024;
        singleQuota['max-objects'] = objectCapacity;
        request.updateBucketQuota(singleQuota).then(quotaRes => {
          cb(true);
          callback && callback();
        }).catch(error => cb(false, getErrorMessage(error)));
      } else if (obj.bucket_quota.enabled && !enable) { //(初始化打开配额 && 关闭配额)
        request.disableBucketQuota(obj.bucket).then(enableRes => {
          cb(true);
          callback && callback();
        }).catch(error => cb(false, getErrorMessage(error)));
      } else {//(初始化关闭配额 && 关闭配额) 不进行操作, 直接关闭弹框
        cb(true);
        callback && callback();
      }
    },
    onAction: function(field, value, form) {
    }
  };

  ModalV2(props);
}

export default pop;
