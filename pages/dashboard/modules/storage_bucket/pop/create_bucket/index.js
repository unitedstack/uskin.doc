import './style/index.less';
import {ModalV2} from 'ufec';
import config from './config';
import  __ from 'client/locale/dashboard.lang.json';
import getErrorMessage from '../../../../utils/error_message';

import request from '../../request';


function pop(obj, parent, callback) {
  let resData = [];
  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(form, updateFields) {
      request.getUserList().then(res => {
        updateFields({
          owner: {
            data: res.data,
            nameType: 'display_name',
            hide: false,
          }
        });
        form.setFields({
          owner: {
            value: res.data[0] && res.data[0].id
          }
        });
      });
      request.getDataPolicy().then(res => {
        updateFields({
          data_policy: {
            data: res.data,
            nameType: 'id'
          }
        });

        resData = res.data;

        let defaultArr = res.data.filter(item => {
          return item.default && item.default === true;
        });


        form.setFields({
          data_policy: {
            value: defaultArr && defaultArr[0].id
          }
        });
      });

      const publicAccess = [{
        id: 'private',
        name: __.private
      }, {
        id: 'public-read',
        name: __.public_read
      }, {
        id: 'public-read-write',
        name: __.public_read_write
      }, {
        id: 'authenticated-read',
        name: __.authenticated_read
      }];

      updateFields({
        public_access: {
          data: publicAccess
        },
        owner: {
          nameType: 'display_name'
        }
      });
    },
    onConfirm: function(values, cb, closeImmediately) {
      let confirm = values.confirm,
        enable = values.enable,
        name = values.bucket_name,
        owner = values.owner,
        bucketCapacity = values.bucket_capacity,
        objectCapacity = values.object_capacity,
        placement = values.data_policy,
        data = { name: name },
        singleQuota = {},
        updateData = { Bucket: name };

      let defaultArr = resData.filter(item => {
        return !(item.default && item.default === true);
      });

      defaultArr.forEach(i => {
        if(i.id === values.data_policy) {
          data.placement = placement;
        }
      });

      if (confirm && confirm.length > 0) { //高级选项打开
        updateData.ACL = values.public_access;
        if (enable && enable.length > 0) { //开启配额
          singleQuota.bucket = name;
          singleQuota['max-size'] = bucketCapacity * 1024 * 1024;
          singleQuota['max-objects'] = objectCapacity;
        }
      }

      request.createBucket(data).then(res => {
        request.linkOwner(owner, name, res.bucket_info.bucket.bucket_id).then(owner => {
          if (confirm && confirm.length > 0) {
            request.updateAcl(updateData).then(res => {
              if (enable && enable.length > 0 ) { //开启配额
                request.enableBucketQuota(name).then(enableRes=> {
                  request.updateBucketQuota(singleQuota).then(quotaRes => {
                    cb(true);
                    callback && callback();
                  });
                });
              } else {
                cb(true);
                callback && callback();
              }
            }).catch(error => cb(false, getErrorMessage(error)));
          } else {
            cb(true);
            callback && callback();
          }
        }).catch(error => cb(false, getErrorMessage(error)));
      }).catch(error => cb(false, getErrorMessage(error)));
    },
    onAction: function(field, value, form) {
    }
  };

  ModalV2(props);
}

export default pop;
