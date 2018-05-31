import React from 'react';
import request from '../request';

class ServiceStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        mon: {
          available: 0,
          unavailable: 0
        },
        osd: {
          available: 0,
          unavailable: 0
        },
        mgr: {
          available: 0,
          unavailable: 0
        },
        mds: {
          available: 0,
          unavailable: 0
        }
      }
    };

    this.timer = null;
  }

  componentDidMount() {
    request.getServiceStatusData().then(res => {
      this.setState({
        data: res
      });
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getServiceStatusData().then(res => {
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
      <div className="service-status-card">
        <div className="service-status-card-title">{__.service_status}</div>
        <div className="service-status-card-content-wrapper">
          <ul>
            {
              ['mon', 'mgr', 'osd', 'mds'].map(service => {
                return (
                  <li key={service}>
                    <div className="top">
                      <div className="avail">
                        <div className="value" style={service === 'mds' ? {fontSize: 16} : null}>
                          {
                            service === 'mds' ? __.n_a: data[service].available
                          }
                        </div>
                        <div className="label">
                          <div className="circle"></div>
                          <div className="text">{__.available}</div>
                        </div>
                      </div>
                      <div className="unavail">
                        <div className="value" style={service === 'mds' ? {fontSize: 16} : null}>
                          {
                            service === 'mds' ? __.n_a : data[service].unavailable
                          }
                        </div>
                        <div className="label">
                          <div className="circle"></div>
                          <div className="text">{__.unavailable}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bottom">{service.toUpperCase()}</div>
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

export default ServiceStatus;
