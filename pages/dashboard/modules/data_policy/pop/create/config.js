export default {
  title: ['create', 'data_policy'],
  fields: [{
    type: 'input',
    field: 'name',
    required: true,
    decorator: {
      id: 'name',
      rules: [{
        required: true,
        message: 'input_name_tip'
      }]
    }
  }, {
    type: 'select',
    field: 'associated_pool',
    value: '',
    hide: true,
    data: [],
    decorator: {
      id: 'associated_pool'
    }
  }, {
    type: 'checkbox',
    field: 'option',
    hasLabel: false,
    data: [{
      label: 'option',
      value: 'option'
    }],
    decorator: {
      id: 'option'
    },
    linkList: [{
      id: 'yorn_default',
      hide: value => !( value.length > 0 )
    }, {
      id: 'yorn_zip',
      hide: value => !( value.length > 0 )
    }, {
      id: 'yorn_index',
      hide: value => !( value.length > 0 )
    }]
  }, {
    type: 'checkbox',
    field: 'yorn_default',
    hasLabel: false,
    data: [{
      label: 'yorn_default',
      value: 'yorn_default'
    }],
    decorator: {
      id: 'yorn_default'
    },
    hide: true
  }, {
    type: 'checkbox',
    field: 'yorn_zip',
    hasLabel: false,
    data: [{
      label: 'yorn_zip',
      value: 'yorn_zip'
    }],
    hide: true,
    decorator: {
      id: 'yorn_zip'
    },
    linkList: [{
      id: 'select_zip',
      hide: value => !( value.length > 0 )
    }]
  }, {
    type: 'select',
    field: 'select_zip',
    value: 'zlib',
    data: [{'id': 'zlib', 'name': 'zlib'}],
    hide: true,
    decorator: {
      id: 'select_zip'
    }
  }, {
    type: 'checkbox',
    field: 'yorn_index',
    hasLabel: false,
    data: [{
      label: 'yorn_index',
      value: 'yorn_index'
    }],
    hide: true,
    decorator: {
      id: 'yorn_index'
    }
  }],
  btn: {
    value: 'create',
    type: 'primary',
    disabled: true
  }
};
