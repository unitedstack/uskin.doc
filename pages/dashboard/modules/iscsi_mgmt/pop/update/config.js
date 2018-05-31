export default {
  title: ['modify', 'client'],
  fields: [{
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
  }],
  btn: {
    value: 'modify',
    type: 'primary'
  }
};
