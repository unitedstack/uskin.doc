export default {
  title: ['modify_osd'],
  fields: [{
    field: 'pool',
    type: 'iconLabel'
  }, {
    field: 'OSD',
    type: 'treeSelect',
    hide: true,
    decorator: {
      id: 'OSD'
    }
  }],
  btn: {
    value: 'modify',
    type: 'primary',
    disabled: true
  }
};
