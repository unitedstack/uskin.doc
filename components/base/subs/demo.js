import React from 'react';
import uskin from 'uskin';

class Demo extends React.Component {
  constructor(props) {
    super(props);
  }
  static getSub(props, index) {
    let type = props.type;
    const arr = type.split('');
    arr[0] = arr[0].toUpperCase();
    type = arr.join('');
    const Sub = uskin[type];
    return (<Sub key={index} {...props.config} />);
  }
  render() {
    const props = this.props;
    return (
      <div className="demo-container">
        {
          props.data instanceof Array ?
            props.data.map((item, index) => Demo.getSub(item, index)) :
            this.getSub(props)
        }
      </div>
    );
  }
}

export default Demo;
