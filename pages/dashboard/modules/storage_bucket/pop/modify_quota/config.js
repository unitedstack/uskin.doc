export default {
  title: ['modify', 'quota'],
  fields: [{
    type: 'checkbox',
    field: 'enable',
    decorator: {
      id: 'enable'
    },
    data: [{
      label: 'enable',
      value: 'enable'
    }],
    linkList: [{
      id: 'bucket_capacity',
      disabled: value => !( value.length > 0 )
    }, {
      id: 'object_capacity',
      disabled: value => !( value.length > 0 )
    }]
  }, {
    type: 'input',
    field: 'bucket_capacity',
    decorator: {
      id: 'bucket_capacity'
    },
    addonAfter: 'GB',
    disabled: true
  }, {
    type: 'input',
    field: 'object_capacity',
    decorator: {
      id: 'object_capacity'
    },
    addonAfter: 'buckets_entres',
    disabled: true
  }, {
    type: 'alert',
    field: 'alert_tip',
    tip_type: 'warning',
    message: 'alert_quota_tip'
  }],
  btn: {
    value: 'modify',
    type: 'primary',
    disabled: true
  }
};
