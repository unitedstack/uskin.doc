import React from 'react';
import request from '../request';

class DiskStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        total: 0,
        healthy: 0,
        alarmed: 0,
        wrong: 0
      }
    };

    this.timer = null;
  }

  componentDidMount() {
    request.getDiskStatus().then(res => {
      this.setState({
        data: res
      });
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getDiskStatus().then(res => {
        this.setState({
          data: res
        });
      });
    }, 10000);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    const { __ } = this.props;
    const { data } = this.state;

    return (
      <div className="disk-status-card">
        <div className="disk-status-card-left">
          <div className="disk-status-card-title">{__.disk_status}</div>
          <div className="count-wrapper">
            <div className="text">{__.total_d}</div>
            <div className="value">{data.total}</div>
            <div className="unit"></div>
          </div>
        </div>
        <div className="disk-status-card-right">
          <ul>
            {
              ['healthy', 'alarmed', 'wrong'].map(status => {
                return (
                  <li key={status} className={status}>
                    <div className="text">{__[status]}</div>
                    <div className="value">{data[status]}</div>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default DiskStatus;
