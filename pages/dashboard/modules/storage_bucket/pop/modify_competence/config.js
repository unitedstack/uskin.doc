export default {
  title: ['modify', 'competence'],
  fields: [{
    type: 'select',
    field: 'public_access',
    data: [],
    decorator: {
      id: 'public_access',
      rules: [{
        required: true
      }]
    }
  }, {
    type: 'checkboxTable',
    field: 'specific_access',
    required: true,
    title: ['user_name', 'competence'],
    addValue: 'add_user',
    decorator: {
      id: 'specific_access'
    }
  }],
  btn: {
    value: 'modify',
    type: 'primary'
  }
};
