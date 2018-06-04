import React from 'react';
import Demo from './subs/demo';
import Description from './subs/description';
import './style/index.less';

class Base extends React.Component {
  constructor(props) {
    super(props);
    const demo = JSON.parse(JSON.stringify(props.demo));
    const description = JSON.parse(JSON.stringify(props.description));
    this.state = {
      demo,
      description,
      hide: description.hide,
    };
  }
  onAction(field, data) {
    const description = JSON.parse(JSON.stringify(this.props.description));
    switch (field) {
      case 'description':
        description.hide = data.closed;
        break;
      default: break;
    }
    this.setState({
      description,
      hide: description.hide,
    });
  }
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div className="base-container">
        <div className="title">基础用法</div>
        <Demo {...state.demo} />
        <Description {...state.description} onAction={(field, data) => this.onAction(field, data)} />
        <div style={{ display: state.hide ? 'none' : 'block' }} dangerouslySetInnerHTML={{ __html: props.code }} />
      </div>
    );
  }
}


export default Base;
