import './style/index.less';

import React from 'react';
import IODetail from './components/io_detail';
import IOPSCard from './components/iops_card';
import BandwidthCard from './components/bandwidth_card';
import ClusterDataStatus from './components/cluster_data_status';
import ClusterCapacityUse from './components/cluster_capacity_use';
import ServiceStatus from './components/service_status';
import ServerStatus from './components/server_status';
import DiskStatus from './components/disk_status';
import AlertCard from './components/alert_card';
import SystemDetail from './components/system_detail';

class Model extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      largeScreenDevice: false
    };

    this.container = null;
  }

  componentDidMount() {
    this.setState({
      largeScreenDevice: this.isLargeScreenDevice()
    });
  }


  isLargeScreenDevice() {
    const containerHeight = this.container.clientHeight;
    // 高度需要参考 CSS
    if(containerHeight === 908) {
      return true;
    }
    return false;
  }

  render() {
    const { __ } = this.props;
    return (
      <div className="garen-module-overview">
        <div className="top">
          <IODetail __={__}/>
        </div>
        <div className="bottom" ref={elem => { this.container = elem; }}>
          <div className="left">
            <IOPSCard __={__} collapsed={this.props.collapsed}
              largeScreenDevice={this.state.largeScreenDevice} />
            <BandwidthCard __={__} collapsed={this.props.collapsed}
              largeScreenDevice={this.state.largeScreenDevice} />
            <div className="cluster-card-wrapper">
              <ClusterDataStatus __={__} collapsed={this.props.collapsed}
                largeScreenDevice={this.state.largeScreenDevice} />
              <ClusterCapacityUse __={__} collapsed={this.props.collapsed}
                largeScreenDevice={this.state.largeScreenDevice} />
            </div>
          </div>
          <div className="right">
            <ServiceStatus __={__} />
            <ServerStatus __={__} />
            <DiskStatus __={__} />
            <AlertCard __={__} collapsed={this.props.collapsed}
              largeScreenDevice={this.state.largeScreenDevice} />
            <SystemDetail __={__} />
          </div>
        </div>
      </div>
    );
  }

}

export default Model;
