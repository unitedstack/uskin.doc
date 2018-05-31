export default {
  title: ['delete_snapshot'],
  fields: [{
    type: 'text',
    field: 'delete_text',
    info: 'sure_to_delete_snapshot'
  }, {
    type: 'alertWithClick',
    tip_type: 'warning',
    field: 'close_tip',
    message: 'sure_to_delete_snapshot_tip',
    linkText: 'close_snapshot_protection'
  }],
  btn: {
    value: 'delete',
    type: 'danger'
  }
};
