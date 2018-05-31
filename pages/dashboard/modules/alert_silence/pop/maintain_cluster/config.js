export default {
  title: ['maintain_cluster'],
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
  }],
  'btn': {
    'value': 'confirm',
    'type': 'primary'
  }
};
