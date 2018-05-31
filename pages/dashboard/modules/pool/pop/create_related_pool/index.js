import {ModalPlus} from 'ufec';
import c from './config';
import __ from 'client/locale/dashboard.lang.json';
import deepClone from '../../../../../../utils/deep_clone';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

const coldPool = 'metadata,data,block,cloud,iscsi';
const hotPool = 'cache';

function pop(obj, isModify, currentType, callback) {

  let config = deepClone(c);
  config.fields[0].hide = isModify;
  config.fields[1].hide = isModify;
  config.title = isModify ? ['modify_related_pool'] : ['create_related_pool'];
  config.btn.value = isModify ? 'modify' : 'create';

  const setPool = index => {
    config.fields[index].data = [{
      id: obj.id,
      name: obj.pool_name
    }];
    config.fields[index].disabled = true;
    config.fields[index].decorator.initialValue = obj.id;
  };
  // 如果不是修改的话，需要通过判断是数据存储池或者缓存存储池来设置name
  if(!isModify) {
    if(currentType === coldPool) {
      setPool(0);
    } else if(currentType === hotPool) {
      setPool(1);
    }
  }

  let props = {
    __,
    config,
    onInitialize(form, updateFields) {
      let type = coldPool;
      let id;
      if(currentType === coldPool) {
        type = hotPool;
        id = obj.tiers && obj.tiers[0];
      } else if(currentType === hotPool) {
        type = coldPool;
        id = obj.tier_of;
      }
      request.getList(type, 0, 0).then(pools => {
        // 如果是修改的话，拿到关联的存储池，更新值
        if(isModify) {
          const relatedOne = pools.data.find(pool => pool.pool === id);
          // 如果是数据存储池的话，需要通过api拿到的缓存存储池中找对应的关联。
          // 如果是缓存存储池的话，直接读该缓存存储池的数据即可
          const cacheData = currentType === hotPool ? obj : relatedOne;
          form.setFields({
            min_read_recency_for_promote: {
              value: cacheData.params.min_read_recency_for_promote
            },
            min_write_recency_for_promote: {
              value: cacheData.params.min_write_recency_for_promote
            },
            hit_set_count: {
              value: cacheData.params.hit_set_count
            },
            hit_set_period: {
              value: cacheData.params.hit_set_period
            },
            hit_set_grade_decay_rate: {
              value: cacheData.params.hit_set_grade_decay_rate
            },
            cache_target_dirty_ratio: {
              value: cacheData.params.cache_target_dirty_ratio
            },
            cache_target_full_ratio: {
              value: cacheData.params.cache_target_full_ratio
            },
            cache_target_dirty_high_ratio: {
              value: cacheData.params.cache_target_dirty_high_ratio
            }
          });
        } else {
          let poolList = [];
          pools.data.forEach(pool => {
            if(!pool.tiername_of) {
              poolList.push({
                id: pool.id,
                name: pool.pool_name
              });
            }
          });
          if(currentType === coldPool) {
            updateFields({
              hot_pool: {
                data: poolList
              }
            });
          } else if(currentType === hotPool) {
            updateFields({
              cold_pool: {
                data: poolList
              }
            });
          }
        }
      });
    },
    onConfirm (values, cb, closeImmediately) {
      let data = {
        mode: values.caching_strategy
      };
      // 展开高级选项
      if(values.expand && values.expand.length > 0) {
        data.min_read_recency_for_promote = values.min_read_recency_for_promote;
        data.min_write_recency_for_promote = values.min_write_recency_for_promote;
        data.hit_set_count = values.hit_set_count;
        data.hit_set_period = values.hit_set_period;
        data.hit_set_grade_decay_rate = values.hit_set_grade_decay_rate;
        data.cache_target_dirty_ratio = values.cache_target_dirty_ratio;
        data.cache_target_full_ratio = values.cache_target_full_ratio;
        data.cache_target_dirty_high_ratio = values.cache_target_dirty_high_ratio;
      }

      if(isModify) {
        request.updateRelatedPool(obj.pool_name, obj.tiernames[0], data).then(res => {
          cb(true);
          callback && callback();
        }).catch(err => {
          cb(false, getErrorMessage(err));
        });
      } else {
        values.hitset_type = 'bloom';
        request.createRelatedPool(values.cold_pool, values.hot_pool, data).then(res => {
          cb(true);
          callback && callback();
        }).catch(err => {
          cb(false, getErrorMessage(err));
        });
      }
    }
  };

  ModalPlus(props);
}

export default pop;

