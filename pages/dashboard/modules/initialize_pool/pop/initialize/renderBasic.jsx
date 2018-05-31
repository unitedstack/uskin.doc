import React from 'react';
import __ from 'client/locale/dashboard.lang.json';

import {Subs} from 'ufec';
const IconLabel = Subs.IconLabel;
const Input = Subs.Input;
const Checkbox = Subs.Checkbox;

class RenderBasic extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const options = [{
      label: 'whether_backup',
      value: 'whether_backup'
    }];

    let hide = !( this.props.form.getFieldValue('backup') && this.props.form.getFieldValue('backup').length > 0 );

    //let hide = false;
    return <div className="bacic-config">
      <IconLabel label={__.namespace} text={__.universal}/>
      <Input
        field="zone-group" type="input"
        __={__}
        label={__.zone_group}
        form={this.props.form}
        placeholder={__.pls_zone_group}
        decorator={{
          id: 'zone-group',
          rules: [{
            required: true,
            message: __.is_required.replace('{0}', __.zone_group)
          }]
        }}/>
      <Input
        field="zone" type="input"
        __={__}
        label={__.zone}
        form={this.props.form}
        placeholder={__.pls_zone}
        decorator={{
          id: 'zone',
          rules: [{
            required: true,
            message: __.is_required.replace('{0}', __.zone)
          }]
        }}/>
      <Checkbox
        field="backup" __={__}
        hasLabel={false}
        label="checkbox"
        form={this.props.form}
        data={options}
        decorator={{
          id: 'backup',
          initialValue: []
        }}/>
      <Input
        field="point-address"
        type="input"
        __={__}
        hide={hide}
        label={__.point_address}
        placeholder={__.pls_point_address}
        form={this.props.form}
        decorator={{
          id: 'point-address',
          rules: [{
            required: true,
            message: __.is_required.replace('{0}', __.point_address)
          }]
        }}/>
      <Input
        field="access-key"
        type="input"
        __={__}
        hide={hide}
        label={__.access_key}
        form={this.props.form}
        placeholder={__.pls_access_key}
        decorator={{
          id: 'access-key',
          rules: [{
            required: true,
            message: __.is_required.replace('{0}', __.access_key)
          }]
        }}/>
      <Input
        field="security-key"
        type="input"
        __={__}
        hide={hide}
        label={__.security_key}
        form={this.props.form}
        placeholder={__.pls_sec_key}
        decorator={{
          id: 'security-key',
          rules: [{
            required: true,
            message: __.is_required.replace('{0}', __.security_key)
          }]
        }}/>
    </div>;
  }
}

export default RenderBasic;