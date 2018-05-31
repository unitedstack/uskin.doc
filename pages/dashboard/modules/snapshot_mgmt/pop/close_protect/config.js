export default {
  title: ['turn_off', 'snapshot_protection'],
  fields: [{
    type: 'text',
    field: 'sure_close',
    info: 'sure_to_close_snapshot_protection'
  }, {
    type: 'alertWithClick',
    tip_type: 'warning',
    field: 'close_tip',
    message: 'sure_to_close_snapshot_protection_tip',
    linkText: 'unlink'
  }],
  btn: {
    value: 'turn_off',
    type: 'primary'
  }
};
