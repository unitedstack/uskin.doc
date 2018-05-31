import './style/index.less';
import React from 'react';
import echarts from 'client/libs/chart/index';

const option = {
  textStyle: {
    fontFamily: 'Microsoft YaHei'
  },
  series: [{
    type: 'pie',
    name: 'pieChart',
    hoverOffset: 2,
    selectedOffset: 2,
    label: {
      normal: {
        show: false,
        textStyle: {
          fontSize: 30,
          fontWeight: 'normal',
          color: '#252F3D'
        }
      }
    },
    itemStyle: {
      borderWidth:1,
      borderColor: '#fff'
    },
    center: ['50%', '50%'],
    radius: [0, 55]
  }, {
    type: 'pie',
    name: 'pieChart',
    hoverOffset: 2,
    selectedOffset: 2,
    label: {
      normal: {
        show: false,
        textStyle: {
          fontSize: 30,
          fontWeight: 'normal',
          color: '#252F3D'
        }
      }
    },
    itemStyle: {
      borderWidth:1,
      borderColor: '#fff'
    },
    center: ['50%', '50%'],
    radius: [0, 55]
  }]
};

class PropertyMonitor extends React.Component {
  constructor(props) {
    super(props);

    this.chart = null;
  }

  componentDidMount() {
    this.addDataForOption(option);

    this.chart = echarts.init(this.divElem);
    this.chart.setOption(option);
  }

  componentDidUpdate(prevProps, prevState) {
    this.addDataForOption(option);
    this.chart.setOption(option);
  }

  addDataForOption(option, data) {
    const { kStrategy, mkStrategy } = this.props;
    option.series[0].data = [];

    if (kStrategy === void(0)) {
      for(let i = 0; i < mkStrategy; i ++) {
        option.series[0].data.push({
          name: 'total',
          value: mkStrategy,
          itemStyle: {
            color: '#01AFC9'
          }
        });
      }
    } else {
      for(let i = 0; i < mkStrategy; i ++) {
        if (i < kStrategy) {
          option.series[0].data.push({
            name: 'total',
            value: mkStrategy,
            itemStyle: {
              color: '#01AFC9'
            }
          });
        } else {
          option.series[0].data.push({
            name: 'total',
            value: mkStrategy,
            itemStyle: {
              color: '#ffffff',
              borderWidth: 1,
              borderColor: '#C1C1C1',
              borderType: 'dashed'
            }
          });
        }
      }
    }
  }

  render() {
    const { __ } = this.props;
    return (
      <div>
        <div className="cluster-actual-capacity-card-bar-chart" ref={(elem) => this.divElem = elem}></div>
        <div className="cluster-actual-capacity-card-legend-wrapper">
          <div className="text">
            <span>{this.props.data.num}</span>
            {this.props.data.unit}
            <div>{__[this.props.status]}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PropertyMonitor;
