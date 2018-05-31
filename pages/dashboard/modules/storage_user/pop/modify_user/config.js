export default {
  title: ['modify', 'user', 'information'],
  fields: [{
    type: 'input',
    field: 'email',
    decorator: {
      id: 'email',
      rules: [{
        type: 'email',
        message: 'email_tip'
      }]
    }
  }, {
    type: 'checkbox',
    field: 'system_user',
    decorator: {
      id: 'system_user'
    },
    data: [{
      label: 'system_user',
      value: 'system_user'
    }],
    hasLabel: false
  }],
  btn: {
    value: 'modify',
    type: 'primary'
  }
};
