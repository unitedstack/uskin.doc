export default {
  title: ['modify', 'quota'],
  fields: [{
    type: 'inputNumber',
    field: 'bucket_qutoa',
    addonAfter: 'buckets_entres',
    decorator: {
      id: 'bucket_qutoa',
      rules: [{
        required: false,
        message: 'pls_select_size'
      }]
    }
  }, {
    type: 'checkbox',
    field: 'enable',
    hasLabel: false,
    decorator: {
      id: 'enable'
    },
    data: [{
      label: 'enable_userQuota',
      value: 'enable'
    }]
  }, {
    type: 'inputNumber',
    field: 'capacity_qutoa',
    addonAfter: 'GB',
    disabled: true,
    decorator: {
      id: 'capacity_qutoa',
      rules: [{
        required: false,
        message: 'pls_select_size'
      }]
    }
  }, {
    type: 'inputNumber',
    field: 'objects_qutoa',
    addonAfter: 'objects_entres',
    disabled: true,
    min: -1,
    decorator: {
      id: 'objects_qutoa',
      rules: [{
        required: false,
        message: 'pls_select_size'
      }]
    }
  }, {
    type: 'checkbox',
    field: 'enable_defaultQuota',
    hasLabel: false,
    decorator: {
      id: 'enable_defaultQuota'
    },
    data: [{
      label: 'enable_defaultQuota',
      value: 'enable'
    }]
  }, {
    type: 'inputNumber',
    field: 'bucket_capacity',
    addonAfter: 'GB',
    disabled: true,
    decorator: {
      id: 'bucket_capacity',
      rules: [{
        required: false,
        message: 'pls_select_size'
      }]
    }
  }, {
    type: 'inputNumber',
    field: 'object_capacity',
    addonAfter: 'objects_entres',
    disabled: true,
    min: -1,
    decorator: {
      id: 'object_capacity',
      rules: [{
        required: false,
        message: 'pls_select_size'
      }]
    }
  }, {
    type: 'alert',
    field: 'alert_tip',
    tip_type: 'warning',
    message: 'alert_quota_tip'
  }],
  btn: {
    value: 'modify',
    type: 'primary',
    disabled: false
  }
};