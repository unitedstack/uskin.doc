import React from 'react';
import echarts from 'client/libs/chart/index';
import request from '../request';

const option = {
  textStyle: {
    fontFamily: 'MicrosoftYaHei'
  },
  title: {
    top: 32,
    left: 30,
    padding: 0,
    itemGap: 14,
    text: 'total_d',
    textStyle: {
      fontSize: 12,
      fontWeight: 'lighter',
      color: '#393C40'
    },
    subtextStyle: {
      fontSize: 24,
      color: '#393C40'
    }
  },
  tooltip: {
    trigger: 'item',
    padding: 0,
    backgroundColor: 'transparent',
    position: function(point) {
      return [point[0] - 23, 97];
    },
    formatter: function(params) {
      const wrapperStyle = {
        position: 'relative',
        width: '46px',
        height: '32px',
        'line-height': '32px'
      };
      let wrapperStyleStr = '';
      for(let i in wrapperStyle) {
        wrapperStyleStr += i + ':' + wrapperStyle[i] + ';';
      }

      let str = '<div style="' + wrapperStyleStr + '">';

      const contentStyle = {
        width: '100%',
        height: '100%',
        background: params.color,
        color: '#fff',
        'font-size': '12px',
        'text-align': 'center',
        'border-radius': '2px'
      };
      let contentStyleStr = '';
      for(let i in contentStyle) {
        contentStyleStr += i + ':' + contentStyle[i] + ';';
      }

      str += '<div style="' + contentStyleStr + '">' +
        params.value + '</div>';

      const circleStyle = {
        position: 'absolute',
        'box-sizing': 'content-box',
        bottom: '-19px',
        left: '19px',
        width: '3px',
        height: '3px',
        'border-width': '8px 3px',
        'border-color': params.color + ' transparent transparent transparent',
        'border-style': 'solid'
      };
      let circleStyleStr = '';
      for(let i in circleStyle) {
        circleStyleStr += i + ':' + circleStyle[i] + ';';
      }

      str += '<div style="' + circleStyleStr + '"></div></div>';
      return str;
    }
  },
  grid: {
    top: 145,
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
    stack: true,
    color: '#EF6D64',
    emphasis: {
      itemStyle: {
        color: '#EF6D64'
      }
    }
  }, {
    type: 'bar',
    name: 'unavailable',
    yAxisIndex: 0,
    xAxisIndex: 0,
    stack: true,
    color: '#eaeaea',
    emphasis: {
      itemStyle: {
        color: '#eaeaea'
      }
    }
  }]
};

class ClusterDataStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        total: 0,
        healthy: 0,
        degraded: 0,
        wait_recovery: 0,
        unavailable: 0
      }
    };

    this.timer = null;
    this.chart = null;
  }

  componentDidMount() {
    const { data } = this.state;
    this.addDataForOption(option, data);
    this.translateOption(option);
    this.chart = echarts.init(this.divElem);
    this.chart.setOption(option);

    request.getClusterDataStatusData().then(res => {
      this.setState({
        data: res
      });
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getClusterDataStatusData().then(res => {
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

  componentDidUpdate(prevProps) {
    const { data } = this.state;
    this.addDataForOption(option, data);
    this.chart.setOption(option);
  }

  resizeChart() {
    const { collapsed } = this.props;
    const originalWidth = this.divElem.clientWidth;
    const scaledWidth = (200 - 80) * 0.5 * 0.6;

    const newWidth = originalWidth + (collapsed ? -scaledWidth : scaledWidth);
    this.chart.resize({
      width: newWidth
    });
  }

  addDataForOption(option, data) {
    option.title.subtext = data.total;
    option.series.forEach(ser => {
      ser.data = [data[ser.name]];
    });
  }

  translateOption(option) {
    const { __ } = this.props;
    option.title.text = __[option.title.text];
  }

  render() {
    const { __ } = this.props;
    const lang = GAREN.locale;

    return (
      <div className="cluster-data-status-card">
        <div className="cluster-data-status-card-title">
          { __.cluster_data_status }
        </div>
        <div className="cluster-data-status-card-bar-chart" ref={(elem) => this.divElem = elem}></div>
        <div className="cluster-data-status-card-legend-wrapper">
          <ul>
            {
              ['healthy', 'degraded', 'wait_recovery', 'unavailable'].map((status, index) => {
                // 英语下格式要调一下
                const style = (index % 2 === 1 && lang === 'en') ? { width: 65 } : null;

                return (
                  <li key={status} className={status}>
                    <div className="roundRect"></div>
                    <div className="text" style={style}>{__[status]}</div>
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

export default ClusterDataStatus;
