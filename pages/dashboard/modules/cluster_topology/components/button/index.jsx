import React from 'react';
import Circle from 'client/components/status_with_circle/index';
import status from '../../status';

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`garen-module-topology-com-button ${this.props.type}`}>
        <Circle customCfg={{circle: status[this.props.type].color, color: 'black'}} text={this.props.text} />
      </div>
    );
  }
}

export default Button;