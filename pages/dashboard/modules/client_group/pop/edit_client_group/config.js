export default {
  title: ['edit_client_group'],
  fields: [{
    type: 'input',
    field: 'client_group',
    decorator: {
      id: 'client_group'
    },
    disabled: true
  }, {
    type: 'select',
    multiple: true,
    data: [],
    field: 'associate_clients',
    decorator: {
      id: 'associate_clients',
      initialValue: []
    }
  }],
  btn: {
    value: 'confirm',
    type: 'primary'
  }
};
