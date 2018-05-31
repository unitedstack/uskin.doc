export default {
  title: ['create', 'bucket'],
  fields: [{
    type: 'input',
    field: 'bucket',
    decorator: {
      id: 'bucket_name',
      rules: [{
        required: true,
        message: 'bucket_name_tip'
      }]
    }
  }, {
    type: 'select',
    field: 'owner',
    hide: true,
    decorator: {
      id: 'owner'
    }
  }, {
    type: 'checkbox',
    field: 'confirm',
    decorator: {
      id: 'confirm'
    },
    data: [{
      label: 'option',
      value: 'option'
    }],
    linkList: [{
      id: 'enable',
      hide: value => !( value.length > 0 )
    }, {
      id: 'bucket_capacity',
      hide: value => !( value.length > 0 )
    }, {
      id: 'object_capacity',
      hide: value => !( value.length > 0 )
    }, {
      id: 'public_access',
      hide: value => !( value.length > 0 )
    }, {
      id: 'data_policy',
      hide: value => !( value.length > 0 )
    }]
  }, {
    type: 'checkbox',
    field: 'enable',
    decorator: {
      id: 'enable'
    },
    hide: true,
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
    hide: true,
    disabled: true,
    addonAfter: 'GB'
  }, {
    type: 'input',
    field: 'object_capacity',
    addonAfter: 'objects_entres',
    tipTitle: 'unlimit',
    hide: true,
    disabled: true,
    decorator: {
      id: 'object_capacity'
    }
  }, {
    type: 'select',
    field: 'public_access',
    hide: true,
    decorator: {
      id: 'public_access'
    }
  }, {
    type: 'select',
    field: 'data_policy',
    hide: true,
    decorator: {
      id: 'data_policy'
    }
  },],
  btn: {
    value: 'create',
    type: 'primary',
    disabled: true
  }
};
