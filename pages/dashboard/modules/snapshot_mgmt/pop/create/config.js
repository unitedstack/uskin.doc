export default {
  title: ['create', 'clone_volume'],
  fields: [{
    type: 'input',
    field: 'parent_pool',
    placeholder: 'parent_pool',
    decorator: {
      id: 'parent_pool'
    },
    disabled: true
  }, {
    type: 'input',
    field: 'parent_block_storage_volume',
    placeholder: 'parent_block_storage_volume',
    decorator: {
      id: 'parent_block_storage_volume'
    },
    disabled: true
  }, {
    type: 'input',
    field: 'snapshot',
    placeholder: 'snapshot',
    decorator: {
      id: 'snapshot'
    },
    disabled: true
  }, {
    type: 'input',
    field: 'name',
    placeholder: 'name',
    decorator: {
      id: 'name',
      rules: [{
        required: true,
        pattern: /^[a-zA-Z0-9-_]+$/,
        message: 'only_support_letter_number_underscore_dash'
      }]
    },
    extra: 'only_support_letter_number_underscore_dash'
  }, {
    type: 'alertWithClick',
    field: 'alert_tip',
    tip_type: 'warning',
    hide: false,
    message: 'cannot_create_clone_volume_tip',
    linkText: 'protecting_snapshot'
  }, {
    type: 'checkbox',
    field: 'advanced_options',
    decorator: {
      id: 'advanced_options',
      initialValue: []
    },
    hide: true,
    linkList: [{
      id: 'storage_pool',
      hide: value => {
        return value.length === 0;
      }
    }],
    data: [{
      label: 'advanced_options',
      value: 'advanced_options'
    }]
  }, {
    type: 'select',
    field: 'storage_pool',
    decorator: {
      id: 'storage_pool'
    },
    hide: true,
    data: []
  }],
  btn: {
    value: 'create',
    type: 'create'
  }
};
