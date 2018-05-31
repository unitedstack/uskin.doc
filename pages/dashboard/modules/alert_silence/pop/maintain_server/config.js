export default {
  title: ['maintain_server'],
  fields: [{
    type: 'datePicker',
    field: 'maintain_time',
    format: 'YYYY-MM-DD HH:mm',
    showTime: {
      format: 'HH:mm'
    },
    decorator: {
      id: 'maintain_time',
      rules: [{
        required: true,
        message: 'pls_select_maintain_time'
      }]
    }
  }, {
    type: 'input',
    field: 'creator',
    decorator: {
      id: 'creator',
      rules: [{
        required: true,
        message: 'pls_input_creator'
      }]
    }
  }, {
    type: 'textarea',
    field: 'maintain_reason',
    decorator: {
      id: 'maintain_reason'
    }
  }, {
    type: 'select',
    multiple: true,
    field: 'server',
    decorator: {
      id: 'server',
      rules: [{
        required: true,
        message: 'pls_select_server'
      }],
      initialValue: []
    },
    data: []
  }],
  'btn': {
    'value': 'confirm',
    'type': 'primary'
  }
};
