import './style/index.less';
import React from 'react';
import echarts from 'client/libs/chart/index';

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
    type: 'bar',
    name: 'healthy',
    yAxisIndex: 0,
    xAxisIndex: 0,
    barWidth: 4,
    stack: true,
    color: '#29CD7B',
    emphasis: {
      itemStyle: {
        color: '#29CD7B'
      }
    }
  }, {
    type: 'bar',
    name: 'degraded',
    yAxisIndex: 0,
    xAxisIndex: 0,
    barWidth: 4,
    stack: true,
    color: '#FCA625',
    emphasis: {
      itemStyle: {
        color: '#FCA625'
      }
    }
  }, {
    type: 'bar',
    name: 'wait_recovery',
    yAxisIndex: 0,
    xAxisIndex: 0,
    barWidth: 4,
    stack: true,
    color: '#B461DB',
    emphasis: {
      itemStyle: {
        color: '#B461DB'
      }
    }
  }, {
    type: 'bar',
    name: 'unavailable',
    yAxisIndex: 0,
    xAxisIndex: 0,
    barWidth: 4,
    stack: true,
    color: '#C7CBD0',
    emphasis: {
      itemStyle: {
        color: '#C7CBD0'
      }
    }
  }]
};

class PropertyMonitor extends React.Component {
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
    let titleStr = '{text|' + this.props.__.healthy + '}';
    titleStr += `{value|${Math.ceil((data.healthy / data.total) * 100)}}`;
    titleStr += '{unit|%}';

    option.title.text = titleStr;

    option.series.forEach(ser => {
      ser.data = [data[ser.name]];
    });
  }

  render() {
    const { __ } = this.props;
    return (
      <div className="pool-cluster">
        <div className="cluster-data-status-card">
          <div className="cluster-data-status-card-title">
            { __.data_status }
          </div>
          <div className="cluster-data-status-card-bar-chart" ref={(elem) => this.divElem = elem}></div>
          <div className="cluster-data-status-card-legend-wrapper">
            <ul>
              {
                ['healthy', 'degraded', 'wait_recovery', 'unavailable'].map(status => {
                  return (
                    <li key={status} className={status}>
                      <div className="roundRect"></div>
                      <div className="text">
                        {__[status]}
                        <span>{Math.ceil((this.props.data[status] / this.props.data.total) * 100)}</span>{'%'}
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

export default PropertyMonitor;
