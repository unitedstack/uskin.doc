export default {
  title: ['create', 'client_group'],
  fields: [{
    type: 'input',
    field: 'client_group',
    decorator: {
      id: 'client_group',
      rules: [{
        required: true,
        message: 'client_group_input_error_pop_msg'
      }]
    }
  }, {
    type: 'select',
    multiple: true,
    data: [],
    field: 'associate_clients',
    decorator: {
      id: 'associate_clients',
      initialValue: []
    }
  }, {
    type: 'select',
    multiple: true,
    data: [],
    field: 'volumes',
    decorator: {
      id: 'volumes',
      initialValue: []
    }
  }],
  btn: {
    value: 'create',
    type: 'primary'
  }
};
