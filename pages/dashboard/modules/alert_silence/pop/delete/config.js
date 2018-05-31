export default {
  title: ['delete_alert_silence'],
  fields: [{
    type: 'alert',
    tip_type: 'error',
    field: 'delete_tip',
    message: 'sure_to_delete_alert_silence'
  }, {
    type: 'alert',
    tip_type: 'warning',
    field: 'delete_tip_prompt',
    message: 'delete_alert_silence_just_set_expired'
  }],
  btn: {
    value: 'delete',
    type: 'danger'
  }
};
