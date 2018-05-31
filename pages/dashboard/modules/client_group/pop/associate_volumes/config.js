export default {
  title: ['associate_block_storage_volumes'],
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
    decorator: {
      id: 'volumes',
      initialValue: []
    },
    field: 'volumes'
  }],
  btn: {
    value: 'confirm',
    type: 'primary'
  }
};
