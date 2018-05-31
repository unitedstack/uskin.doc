import __ from 'client/locale/dashboard.lang.json';

const validator = (rule, value, callback) => {
  if(!value || value > 1 || value < 0) {
    callback(__.tip_0_1);
  } else {
    callback();
  }
};

export default {
  title: ['create_related_pool'],
  fields: [{
    field: 'cold_pool',
    type: 'select',
    placeholder: 'pls_select_cold_pool',
    decorator: {
      id: 'cold_pool',
      rules: [{
        required: true,
        message: 'pls_select_cold_pool'
      }]
    },
    data: []
  }, {
    field: 'hot_pool',
    type: 'select',
    placeholder: 'pls_select_hot_pool',
    decorator: {
      id: 'hot_pool',
      rules: [{
        required: true,
        message: 'pls_select_hot_pool'
      }]
    },
    data: []
  }, {
    field: 'caching_strategy',
    type: 'radio',
    button: true,
    decorator: {
      id: 'caching_strategy',
      rules: [{
        required: true,
        message: 'plaese select!'
      }],
      initialValue: 'readproxy'
    },
    data: [{
      id: 'writeback',
      name: __.write_back
    }, {
      id: 'readonly',
      name: __.readonly
    }, {
      id: 'readproxy',
      name: __.writeonly
    }]
  }, {
    field: 'expand',
    type: 'checkbox',
    decorator: {
      id: 'expand'
    },
    linkList: [{
      id: 'min_read_recency_for_promote',
      hide: value => !( value.length > 0 )
    }, {
      id: 'min_write_recency_for_promote',
      hide: value => !( value.length > 0 )
    }, {
      id: 'hit_set_count',
      hide: value => !( value.length > 0 )
    }, {
      id: 'hit_set_period',
      hide: value => !( value.length > 0 )
    }, {
      id: 'hit_set_grade_decay_rate',
      hide: value => !( value.length > 0 )
    }, {
      id: 'cache_target_dirty_ratio',
      hide: value => !( value.length > 0 )
    }, {
      id: 'cache_target_full_ratio',
      hide: value => !( value.length > 0 )
    }, {
      id: 'cache_target_dirty_high_ratio',
      hide: value => !( value.length > 0 )
    }],
    data: [{
      label: 'expand',
      value: 'expand'
    }]
  }, {
    field: 'min_read_recency_for_promote',
    type: 'inputNumber',
    decorator: {
      id: 'min_read_recency_for_promote'
    },
    hide: true
  }, {
    field: 'min_write_recency_for_promote',
    type: 'inputNumber',
    decorator: {
      id: 'min_write_recency_for_promote'
    },
    hide: true
  }, {
    field: 'hit_set_count',
    type: 'inputNumber',
    decorator: {
      id: 'hit_set_count'
    },
    hide: true
  }, {
    field: 'hit_set_period',
    type: 'inputNumber',
    addonAfter: __.hour,
    decorator: {
      id: 'hit_set_period'
    },
    hide: true
  }, {
    field: 'hit_set_grade_decay_rate',
    type: 'inputNumber',
    tipTitle: 'tip_0_100',
    decorator: {
      id: 'hit_set_grade_decay_rate',
      rules: [{
        validator: (rule, value, callback) => {
          if(!value || value < 0 || value > 100) {
            callback(__.tip_0_100);
          } else {
            callback();
          }
        }
      }]
    },
    hide: true
  }, {
    field: 'cache_target_dirty_ratio',
    type: 'inputNumber',
    tipTitle: 'tip_0_1',
    step: 0.1,
    decorator: {
      id: 'cache_target_dirty_ratio',
      rules: [{
        validator
      }]
    },
    hide: true
  }, {
    field: 'cache_target_dirty_high_ratio',
    type: 'inputNumber',
    step: 0.1,
    tipTitle: 'tip_0_1',
    decorator: {
      id: 'cache_target_dirty_high_ratio',
      rules: [{
        validator
      }]
    },
    hide: true
  }, {
    field: 'cache_target_full_ratio',
    type: 'inputNumber',
    tipTitle: 'tip_0_1',
    step: 0.1,
    decorator: {
      id: 'cache_target_full_ratio',
      rules: [{
        validator
      }]
    },
    hide: true
  }],
  btn: {
    value: 'create',
    type: 'primary'
  }
};
