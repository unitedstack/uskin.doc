import { Link } from 'react-router-dom';
import React from 'react';
import './style/index.less';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props;
    let hasSelected = false;
    data.items.forEach((item) => {
      item.subs.forEach((i) => {
        if (i.selected && !hasSelected) {
          hasSelected = true;
        }
      });
    });
    if (!hasSelected) {
      data.items.forEach((item) => {
        if (item.key === data.default.title) {
          item.subs.forEach((i) => {
            if (i.key === data.default.subtitle) {
              i.selected = true;
              window.location.href = `${window.location.href.split('#/')[0]}#/${i.key}`;
            }
          });
        }
      });
    }
    this.state = {
      data,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps,
    });
  }

  onClick(title, subtitle) {
    if (this.props.onAction) {
      this.props.onAction('menu', {
        title,
        subType: 'subtitle',
        subtitle,
      });
    }
  }

  render() {
    return (
      <div className="side-bar-wrapper">
        {
          this.state.data.items.map((item, index) => (
            <div key={index}>
              <div className="title">{item.title}
              </div>
              <ul style={{ display: item.hide ? 'none' : 'block' }}>
                {
                  item.subs.map(sub => (
                    <li className={sub.selected ? 'selected' : ''} key={sub.key} onClick={() => this.onClick(item.title, sub.subtitle)} >
                      <Link to={`/${sub.key}`}>
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
