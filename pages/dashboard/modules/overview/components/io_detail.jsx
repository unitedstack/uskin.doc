import React from 'react';
import request from '../request';

class IODetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        read_iops: 0,
        write_iops: 0,
        recovery_iops: 0,
        read_bandwidth: 0,
        write_bandwidth: 0,
        recovery_bandwidth: 0
      }
    };

    this.timer = null;
  }

  componentDidMount() {
    request.getInstantIOData().then(res => {
      this.setState({
        data: res
      });
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getInstantIOData().then(res => {
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
      <div className="io-detail-card">
        <div className="io-detail-card-content-wrapper">
          <ul>
            {
              ['read_iops', 'write_iops', 'recovery_iops', 'read_bandwidth',
                'write_bandwidth', 'recovery_bandwidth'].map((item, index) => {
                return (
                  <li key={item}>
                    <div>
                      <div className="value">
                        { data[item] }
                        {
                          index > 2 && <span>MB/s</span>
                        }
                      </div>
                      <div className="name">
                        <span></span>
                        <span>
                          { __[item] }
                        </span>
                      </div>
                    </div>
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

export default IODetail;
