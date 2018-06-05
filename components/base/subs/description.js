import React from 'react';

class Description extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: this.props.hide || false,
    };
  }

  componentDidMount() {
    if (this.props.initialize) {
      this.props.initialize();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      closed: nextProps.hide || false,
    });
  }

  onClick() {
    const closed = this.state.closed;
    if (this.props.onAction) {
      this.props.onAction('description', {
        closed: !closed,
      });
    }
  }

  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div className="description-container">
        <div className="description-left">{props.content}</div>
        <div className={state.closed ? 'description-right code-closed' : 'description-right'} onClick={() => this.onClick()}>
          {
            state.closed ? '显示代码' : '隐藏代码'
          }
        </div>
      </div>
    );
  }
}

export default Description;
