import React from 'react';
import { Icon } from 'antd';
import request from '../request';

class SystemDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: 0,
      snapshot: 0,
      iscsi: 0,
      bucket: 0,
      s3: 0,
      policy: 0
    };

    this.timer = null;
  }

  componentDidMount() {
    request.getRbdCount().then(res => {
      this.setState({
        volume: res.volume,
        snapshot: res.snapshot,
        iscsi: res.iscsi
      });
    });

    const initialized = GAREN.rgw && GAREN.rgw.status === 'initialized' ? true : false;

    if(initialized) {
      request.getRgwCount().then(res => {
        this.setState({
          bucket: res.bucket,
          s3: res.s3,
          policy: res.placement
        });
      });
    }


    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getRbdCount().then(res => {
        this.setState({
          volume: res.volume,
          snapshot: res.snapshot,
          iscsi: res.iscsi
        });
      });

      const initialized = GAREN.rgw && GAREN.rgw.status === 'initialized' ? true : false;

      if(initialized) {
        request.getRgwCount().then(res => {
          this.setState({
            bucket: res.bucket,
            s3: res.s3,
            policy: res.placement
          });
        });
      }
    }, 10000);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    const initialized = GAREN.rgw && GAREN.rgw.status === 'initialized' ? true : false;

    const { __ } = this.props;
    const state = this.state;

    const leftList = [{
      key: 'volume',
      icon: 'storage-volume',
      name: __.storage_volume,
      count: state.volume
    }, {
      key: 'snapshot',
      icon: 'volume-snapshot',
      name: __.volume_snapshot,
      count: state.snapshot
    }, {
      key: 'iscsi',
      icon: 'iscsi-gateway',
      name: __.iscsi_gateway,
      count: state.iscsi ? state.iscsi : __.n_a
    }];

    const rightList = [{
      key: 'bucket',
      icon: 'object-storage',
      name: __.storage_bucket_d,
      count: initialized ? state.bucket : __.n_a
    }, {
      key: 's3',
      icon: 's3-gateway',
      name: __.s3_gateway,
      count: initialized ? state.s3 : __.n_a
    }, {
      key: 'policy',
      icon: 'data-policy',
      name: __.data_policy,
      count: initialized ? state.bucket : __.n_a
    }];

    return (
      <div className="system-detail-card">
        <div className="system-detail-card-left">
          <ul>
            {
              leftList.map(detail => {
                return (
                  <li key={detail.key}>
                    <div className="icon-wrapper">
                      <Icon type={detail.icon} />
                    </div>
                    <div className="content-wrapper">
                      <div className="content-name">{detail.name}</div>
                      <div className="content-count">{detail.count}</div>
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className="system-detail-card-right">
          <ul>
            {
              rightList.map(detail => {
                return (
                  <li key={detail.key}>
                    <div className="icon-wrapper">
                      <Icon type={detail.icon} />
                    </div>
                    <div className="content-wrapper">
                      <div className="content-name">{detail.name}</div>
                      <div className="content-count">{detail.count}</div>
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

export default SystemDetail;

