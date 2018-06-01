import { Link } from 'react-router-dom';
import React from 'react';
import './index.less';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps,
    });
  }

  render() {
    return (
      <div className="side-bar-wrapper">
        {
          this.state.data.items.map((item, index) => (
            <div key={index}>
              <div className="title">{item.title}
                <div className="operator" />
              </div>
              <ul style={{ display: item.hide ? 'none' : 'block' }}>
                {
                  item.subs.map((sub, i) => (
                    <li className={sub.selected ? 'selected' : ''} key={i}>
                      <Link to={`/${sub.subtitle}`}>
                        <span className="en">{sub.subtitle}</span>
                        <span>{sub.subtitleCn}</span>
                      </Link>
                      <div className="inner" />
                    </li>
                  ))
                }
              </ul>
            </div>
          ))
        }
      </div>
    );
  }
}

export default Menu;
