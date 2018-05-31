import React from 'react';
import echarts from 'client/libs/chart/index';
import './style/index.less';
import utilConverter from '../../../../utils/unit_converter';

const option = {
  textStyle: {
    fontFamily: 'MicrosoftYaHei'
  },
  title: {
    top: 32,
    left: 30,
    padding: 0,
    itemGap: 14,
    textStyle: {
      rich: {
        text: {
          fontSize: 12,
          color: '#999'
        },
        value: {
          padding: [0, 6, -5, 10],
          fontSize: 24,
          color: ' #252F3D'
        },
        unit: {
          fontSize: 12,
          color: '#999'
        }
      }
    }
  },
  grid: {
    top: 70,
    left: 30,
    right: 30,
    height: 30
  },
  xAxis: {
    gridIndex: 0,
    type: 'value',
    show: false,
    max: 'dataMax'
  },
  yAxis: {
    gridIndex: 0,
    type: 'category',
    data: ['value'],
    show: false
  },
  series: [{
    legendHoverLink: false,
    type: 'bar',
    name: 'used',
    yAxisIndex: 0,
    xAxisIndex: 0,
    barWidth: 4,
    stack: true,
    color: '#01AFC9',
    emphasis: {
      itemStyle: {
        color: '#01AFC9'
      }
    }
  }, {
    legendHoverLink: false,
    type: 'bar',
    name: 'unused',
    yAxisIndex: 0,
    xAxisIndex: 0,
    barWidth: 4,
    stack: true,
    color: '#eaeaea',
    emphasis: {
      itemStyle: {
        color: '#eaeaea'
      }
    }
  }]
};

class CapacityUse extends React.Component {
  constructor(props) {
    super(props);

    this.chart = null;
  }

  componentDidMount() {
    const { data } = this.props;
    this.addDataForOption(option, data);
    this.chart = echarts.init(this.divElem);
    this.chart.setOption(option);
  }

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props;
    this.addDataForOption(option, data);
    this.chart.setOption(option);
  }

  addDataForOption(option, data) {
    const total = utilConverter(data.total);
    let titleStr = '{text|' + this.props.__.total + '}';
    titleStr += `{value|${total.num}}`;
    titleStr += `{unit|${total.unit}}`;

    option.title.text = titleStr;
    option.series.forEach(ser => {
      ser.data = [data[ser.name]];
    });
  }

  render() {
    const { __ } = this.props;
    return (
      <div className="pool-cluster-use">
        <div className="cluster-capacity-use-card">
          <div className="cluster-capacity-use-card-title">
            { __.cluster_capacity_usage }
          </div>
          <div className="cluster-capacity-use-card-bar-chart" ref={(elem) => this.divElem = elem}></div>
          <div className="cluster-capacity-use-card-legend-wrapper">
            <ul>
              {
                ['unused', 'used'].map(status => {
                  return (
                    <li key={status} className={status}>
                      <div className="roundRect"></div>
                      <div className="text">
                        {__[status]}
                        <span>{utilConverter(this.props.data[status]).num}</span>
                        {utilConverter(this.props.data[status]).unit}
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default CapacityUse;
