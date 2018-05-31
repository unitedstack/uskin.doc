export default {
  title: ['modify', 'data_policy'],
  fields: [{
    type: 'iconLabel',
    field: 'name',
    decorator: {
      id: 'name',
      rules: [{
        message: 'input_name_tip'
      }]
    }
  }, {
    type: 'select',
    field: 'associated_pool',
    value: '',
    data: [],
    decorator: {
      id: 'associated_pool'
    }
  }, {
    type: 'checkbox',
    field: 'yorn_zip',
    hasLabel: false,
    data: [{
      label: 'yorn_zip',
      value: 'yorn_zip'
    }],
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
    data: [],
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
    decorator: {
      id: 'yorn_index'
    }
  }],
  btn: {
    value: 'modify',
    type: 'primary',
    disabled: false
  }
};
