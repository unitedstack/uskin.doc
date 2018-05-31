import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import popOpenProtect from '../open_protect/index';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';


function pop(data, parent, callback) {
  let isProtected = data.snapData.protected === 'true' ? true : false;
  const parentPool = data.snapData.id.split('.')[0];

  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(form, updateFields) {
      form.setFields({
        parent_pool: {
          value: parentPool
        },
        parent_block_storage_volume: {
          value: data.snapData.image
        },
        snapshot: {
          value: data.snapData.snapshot
        }
      });

      request.getPoolList(data.poolType).then(res => {
        updateFields({
          storage_pool: {
            data: res.data.map((pool) => {
              return {
                id: pool.pool_name,
                name: pool.pool_name
              };
            })
          }
        });
      });

      if(isProtected) {
        updateFields({
          alert_tip: {
            hide: true
          },
          advanced_options: {
            hide: false
          }
        });
      }
    },
    onConfirm: function(values, cb) {
      const volumeData = {
        image: values.name
      };
      const snapshotId = data.snapData.id;
      let pool = parentPool;

      // 展开了高级选项，可以选择 pool 否则就是父存储池
      if(values.advanced_options.length !== 0) {
        pool = values.storage_pool;
      }

      volumeData.destPool = pool;

      request.createCloneVolume(snapshotId, volumeData).then(() => {
        cb(true);
        callback && callback();
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    },
    onAction: function(field, value, form, updateFields) {
      switch (field) {
        case 'alert_tip':
          popOpenProtect(data, modalRefList[modalRefList.length - 1], () => {
            // 成功保护快照，修改受保护状态
            isProtected = true;

            updateFields({
              alert_tip: {
                hide: true
              },
              advanced_options: {
                hide: false
              }
            });
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
