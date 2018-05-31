export default {
  title: ['associate_block_storage_volumes'],
  fields: [
    {
      type: 'select',
      multiple: true,
      field: 'volumes',
      decorator: {
        id: 'volumes',
        initialValue: []
      },
      data: []
    }
  ],
  btn: {
    value: 'confirm',
    type: 'primary'
  }
};