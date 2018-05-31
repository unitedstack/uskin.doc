import './style/index.less';
import React from 'react';
import utilConverter from '../../../../utils/unit_converter';

import PieChart from './pie';

class PropertyMonitor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { __, data } = this.props;
    let kStrategy, mkStrategy, strategyArr;
    if (data.strategy.constructor === String) {
      strategyArr = data.strategy.split('+');
      kStrategy = Number(strategyArr[0]);
      mkStrategy = Number(strategyArr[0]) + Number(strategyArr[1]);
    } else if (data.strategy.constructor === Number) {
      kStrategy = 1;
      mkStrategy = data.strategy;
    }

    let maxAvail = utilConverter(data.stats.max_avail + data.stats.bytes_used);
    let avail = utilConverter((data.stats.max_avail + data.stats.bytes_used) / mkStrategy);

    return (
      <div className="pool-cluster-actual">
        <div className="cluster-actual-capacity-card">
          <div className="cluster-actual-capacity-card-title">
            { __.actual_capacity }
          </div>
          <div className="cluster-actual-capacity-pie-chart">
            <div className="pie-chart">
              <PieChart
                __={__}
                status="total_capacity"
                mkStrategy={mkStrategy}
                data={{num: maxAvail.num, unit: maxAvail.unit}}/>
            </div>
            <div className="pie-chart">
              {mkStrategy + ' : ' + kStrategy}
            </div>
            <div className="pie-chart">
              <PieChart
                __={__}
                status="actual_capacity"
                kStrategy={kStrategy}
                mkStrategy={mkStrategy}
                data={{num: avail.num, unit: avail.unit}} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PropertyMonitor;
