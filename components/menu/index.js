import React from 'react';
import './index.less';
import { Link } from 'react-router-dom';

class Menu extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: this.props
    }
  }
  onClick(data) {
    this.props.onAction && this.props.onAction('menu', data)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps
    })
  }
  render() {
    return (
      <div className={'side-bar-wrapper'}>
        {
          this.state.data.items.map((item, index) => {
            return <div key={index}>
              <div className={'title'}>{item.title} <div className={'operator'} onClick={this.onClick.bind(this, {subType: 'title', title: item.title})}></div></div>
              <ul style={{display: item.hide ? 'none' : 'block'}}>
                {
                  item.subs.map((sub, index) => {
                    return <li className={sub.selected ? 'selected' : ''}
                               key={index}
                               onClick={this.onClick.bind(this, {subType: 'subtitle', title: item.title, subtitle: sub.subtitle})}>
                      <Link to={`/${sub.subtitle}`}><span className={'en'}>{sub.subtitle}</span><span>{sub.subtitleCn}</span></Link>
                      <div className={'inner'}></div>
                    </li>
                  })
                }
              </ul>
            </div>
          })
        }
      </div>
    )
  }
}

export default Menu;
