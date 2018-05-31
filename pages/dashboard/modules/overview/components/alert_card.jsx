import React from 'react';
import echarts from 'client/libs/chart/index';
import request from '../request';

const option = {
  textStyle: {
    fontFamily: 'Microsoft YaHei'
  },
  series: [{
    type: 'pie',
    name: 'pieChart',
    hoverOffset: 5,
    selectedOffset: 2,
    label: {
      normal: {
        show: false,
      },
      emphasis: {
        show: true,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: [9, 12, 7, 12],
        borderRadius: 4,
        formatter: '{b}: {c}',
        textStyle: {
          color: '#fff',
          fontSize: 10
        }
      }
    },
    labelLine: {
      show: false
    },
    itemStyle: {
      borderWidth:1,
      borderColor: '#fff'
    },
    center: ['50%', '50%'],
    radius: [45, 55]
  }]
};

const colorMap = {
  information: '#29CD7B',
  warning: '#FDA82A',
  serious: '#EF6D64',
  disaster: '#C3180B'
};

class AlertChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        total: 0,
        information: 0,
        warning: 0,
        serious: 0,
        disaster: 0
      }
    };

    this.timer = null;
    this.chart = null;
  }

  componentDidMount() {
    const { data } = this.state;
    this.addDataForOption(option, data);
    this.chart = echarts.init(this.divElem);
    this.chart.setOption(option);

    request.getAlertData().then(res => {
      this.setState({
        data: res
      });
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getAlertData().then(res => {
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

  componentWillUpdate(nextProps) {
    if(nextProps.collapsed !== this.props.collapsed) {
      // 大屏设备尺寸不变，不需要 resize
      if(!this.props.largeScreenDevice) {
        this.resizeChart();
      }
    }
  }

  resizeChart() {
    const { collapsed } = this.props;
    const originalWidth = this.divElem.clientWidth;
    const scaledWidth = (200 - 80) * 0.5 * 0.55;

    const newWidth = originalWidth + (collapsed ? -scaledWidth : scaledWidth);
    this.chart.resize({
      width: newWidth
    });
  }

  componentDidUpdate() {
    const { data } = this.state;
    this.addDataForOption(option, data);
    this.chart.setOption(option);
  }

  addDataForOption(option, data) {
    const { __ } = this.props;
    if(data.total === 0) {
      option.series[0].data = [0];
      option.series[0].itemStyle = {
        color: '#eaeaea',
        borderWidth:0,
      };
    } else {
      // 只有一种告警的情况下不绘制空隙
      const onlyOneTypeAlert = ['information', 'warning', 'serious', 'disaster'].some(status => {
        return data[status] === data.total;
      });

      let borderWidth;
      if(onlyOneTypeAlert) {
        borderWidth = 0;
      } else {
        borderWidth = 1;
      }

      option.series[0].data = ['information', 'warning', 'serious', 'disaster'].map((status, index) => {
        return {
          name: __[status],
          value: data[status],
          itemStyle: {
            color: colorMap[status],
            borderWidth: borderWidth,
            borderColor: '#fff'
          }
        };
      });
    }
  }

  render() {
    const { __ } = this.props;
    const { data } = this.state;

    return (
      <div className="alert-card">
        <div className="alert-card-title">
          { __.alert }
        </div>
        <div className="alert-card-content-wrapper">
          <div className="alert-card-pie-chart-wrapper">
            <div className="alert-card-pie-chart"
              ref={(elem) => this.divElem = elem}>
            </div>
            <div className="alert-card-pie-chart-total">
              {data.total}
            </div>
          </div>
          <div className="alert-card-pie-chart-legend-wrapper">
            <ul>
              {
                ['information', 'warning', 'serious', 'disaster'].map(status => {
                  return (
                    <li className={status + ' alert-card-pie-chart-legend'} key={status}>
                      <div className="circle"></div>
                      <span className="label">{__[status]}</span>
                      <span className="value">{data[status]}</span>
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

export default AlertChart;
