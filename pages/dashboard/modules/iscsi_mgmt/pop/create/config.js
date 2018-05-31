export default {
  title: ['create', 'client'],
  fields: [{
    type: 'input',
    field: 'iqn',
    decorator: {
      id: 'iqn',
      rules: [{
        required: true,
        pattern: /^iqn\.[12][0-9]{3}\-[0-9]{2}\..+$/,
        message: 'iqn_illegal_check_input'
      }]
    }
  }, {
    type: 'switch',
    field: 'bidirectional_chap',
    decorator: {
      id: 'bidirectional_chap',
      initialValue: false
    },
    linkList: [{
      id: 'user_name',
      hide: value => {
        return !value;
      }
    }, {
      id: 'password',
      hide: value => {
        return !value;
      }
    }]
  }, {
    type: 'input',
    field: 'user_name',
    decorator: {
      id: 'user_name',
      rules: [{
        pattern: /^[0-9a-zA-Z.:@_-]{8,64}$/,
        message: 'user_name_illegal_check_input'
      }],
      initialValue: ''
    },
    hide: true
  }, {
    type: 'input',
    field: 'password',
    inputType: 'password',
    decorator: {
      id: 'password',
      rules: [{
        pattern: /^[0-9a-zA-Z@_-]{12,16}$/,
        message: 'password_illegal_check_input'
      }],
      initialValue: ''
    },
    hide: true
  }],
  'btn': {
    'value': 'create',
    'type': 'primary'
  }
};
