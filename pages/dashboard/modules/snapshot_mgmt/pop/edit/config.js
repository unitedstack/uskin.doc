export default {
  title: ['modify', 'clone_volume'],
  fields: [{
    type: 'input',
    field: 'snapshot_name',
    placeholder: 'snapshot_name',
    decorator: {
      id: 'snapshot_name',
      rules: [{
        required: true,
        message: 'snapshot_name_error_pop_msg',
        pattern: /^[a-zA-Z0-9-_]+$/
      }]
    },
    extra: 'only_support_letter_number_underscore_dash'
  }],
  btn: {
    value: 'modify',
    type: 'primary'
  }
};
