export default {
  title: ['set', 'default_data_policy'],
  fields: [{
    type: 'select',
    field: 'default_data_policy',
    hide: true,
    data: [],
    decorator: {
      id: 'default_data_policy'
    }
  }],
  btn: {
    value: 'set',
    type: 'primary',
    disabled: true
  }
};
