import React from 'react';
import { Select, Icon } from 'antd';
import echarts from 'client/libs/chart/index';
import clone from 'client/utils/deep_clone';
import request from '../request';
import moment from 'moment';
import commonOption from '../line_chart_common_option';

// 对配置的副本操作，避免对配置对象进行直接操作，引发交叉修改
const optionCopy = clone(commonOption);

const Option = Select.Option;
const selectCfg = {
  defaultValue: 'real_time',
  data: [{
    label: 'real_time',
    value: 'real_time'
  }, {
    label: 'within_three_hours',
    value: 'within_three_hours'
  }, {
    label: 'within_one_day',
    value: 'within_one_day'
  }, {
    label: 'within_one_week',
    value: 'within_one_week'
  }, {
    label: 'within_one_month',
    value: 'within_one_month'
  }, {
    label: 'within_three_months',
    value: 'within_three_months'
  }]
};

const tooltipColors = ['#1DCAE0', '#34A7EB', '#8580DF'];

class BandwidthCard extends React.Component {
  constructor(props) {
    super(props);

    this.chart = null;
    this.timer = null;
    this.popupContainer = null;
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount() {
    this.completeOption(optionCopy);
    this.chart = echarts.init(this.divElem);
    this.chart.setOption(optionCopy);
    this.onSelectChange(selectCfg.defaultValue);
  }


  componentWillUpdate(nextProps) {
    if(nextProps.collapsed !== this.props.collapsed) {
      this.resizeChart();
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  resizeChart() {
    const { collapsed, largeScreenDevice } = this.props;
    const originalWidth = this.divElem.clientWidth;
    let newWidth, scaledWidth;

    if(largeScreenDevice) {
      scaledWidth = (200 - 80) * 0.74;
    } else {
      scaledWidth = (200 - 80) * 0.5;
    }

    newWidth = originalWidth + (collapsed ? -scaledWidth : scaledWidth);
    this.chart.resize({
      width: newWidth
    });
  }

  completeOption(option) {
    const { __ } = this.props;
    option.yAxis.axisLabel.formatter = '{value} MB/s';
    const names = ['read_bandwidth', 'write_bandwidth', 'recovery_bandwidth'];
    option.legend.forEach((le, index) => {
      le.data = [names[index]];
      le.formatter = __[names[index]];
    });
    option.series.forEach((se, index) => {
      se.name = names[index];
    });
  }

  updateOption(data) {
    const { __ } = this.props;

    const { minTime, maxTime } = this.getMinAndMaxTime(data);
    const { formatter, interval, timeFormatterStr} =
      this.getAxisLabelAndTooltipFormatter(minTime, maxTime);

    const mbToB = 1024 * 1024;
    this.chart.setOption({
      title: ['read', 'write', 'recovery'].map(se => {
        const latest = data[se].length !== 0 ?
          (data[se][data[se].length-1][1] / mbToB).toFixed(1) : 0;
        return {
          text: latest
        };
      }),
      tooltip: {
        formatter: function(params) {
          const time = moment(params[0].data[0]);
          const wrapperStyle = {
            height: '80px',
            padding: '9px 10px 0 10px',
            'line-height': '14px',
            'font-size': '10px',
            color: '#fff',
            background: 'rgba(0,0,0,0.5)',
            'box-shadow': '0 10px 20px 0 rgba(0,0,0,0.20)',
            'border-radius': '2px'
          };
          let wrapperStyleStr = '';
          for(let i in wrapperStyle) {
            wrapperStyleStr += i + ':' + wrapperStyle[i] + ';';
          }

          let str = '<div style="' + wrapperStyleStr + '">';

          // 时间
          str += '<div style="margin-bottom:2px;">' +
            time.format(timeFormatterStr) + '</div><div>';

          // 数据
          params.forEach((i, index) => {
            str += '<div style="margin-bottom:3px"><div style="display:inline-block;' +
              'width:8px;height:8px;background:#fff;border-radius:4px;' +
              'vertical-align:-0.5px;border:1px solid ' + tooltipColors[index] + ';"></div>' +
              '<span style="margin:0 5px 0 8px">' + __[params[index].seriesName] +
              '</span>' + params[index].data[1] + '<span style="margin-left:4px">MB/s</span></div>';
          });

          str += '</div></div>';
          return str;
        }
      },
      xAxis: {
        axisLabel: {
          formatter: formatter
        },
        interval: interval
      },
      series: ['read', 'write', 'recovery'].map(se => {
        return {
          name: se + '_bandwidth',
          data: data[se].map(d => {
            return [
              d[0] * 1000,
              (d[1] / mbToB).toFixed(1)
            ];
          }),
          tooltip: {
            formatter: function(params) {
              const time = moment(params.data[0]);
              const wrapperStyle = {
                width: '100px',
                height: '45px',
                padding: '9px 0 0 10px',
                'line-height': '12px',
                'font-size': '9px',
                color: '#fff',
                background: params.color,
                'box-shadow': '0 10px 20px 0 rgba(0,0,0,0.20)',
                'border-radius': '2px'
              };
              let wrapperStyleStr = '';
              for(let i in wrapperStyle) {
                wrapperStyleStr += i + ':' + wrapperStyle[i] + ';';
              }

              let str = '<div style="' + wrapperStyleStr + '">';

              // 时间
              str += '<div style="margin-bottom:2px;">' +
                time.format(timeFormatterStr) + '</div>';

              // 数据
              str += '<div>' +
                `<span style="margin-right:4px">${__[params.seriesName]}</span>` +
                `${params.data[1]}</div></div>`;
              return str;
            }
          }
        };
      })
    });
  }

  getMinAndMaxTime(data) {
    const minTimeList = [];
    const maxTimeList = [];
    ['read', 'write', 'recovery'].forEach(item => {
      // min 和 max 都是以秒为单位的时间戳
      const min = data[item].length !== 0 ? data[item][0][0] : 0;
      const max = data[item].length !== 0 ? data[item][data[item].length - 1][0] : 0;
      minTimeList.push(min);
      maxTimeList.push(max);
    });

    const minTime = Math.min.apply(null, minTimeList);
    const maxTime = Math.max.apply(null, maxTimeList);
    return {
      minTime,
      maxTime
    };
  }

  getAxisLabelAndTooltipFormatter(min, max) {
    const range = moment.duration(max - min, 'seconds').asMinutes();
    let formatter, interval, timeFormatterStr;

    if(range <= 1) {
      interval = 5;
      formatter = function(value) {
        return moment(value).format('HH:mm:ss');
      };
      timeFormatterStr = 'HH:mm:ss';
    } else if(range > 1 && range <= 181) {

      // 3小时数据, 60 * 3 + 1，+1是为了避免误差
      interval = 30 * 60;  // 30分钟
      formatter = function(value) {
        return moment(value).format('HH:mm');
      };
      timeFormatterStr = 'HH:mm:ss';
    } else if(range > 181 && range <= 1501) {

      // 1天数据， 25 * 60 + 1, 25是加入了夏令时
      interval = 300 * 60;  // 5小时
      formatter = function (value) {
        return moment(value).format('MM-DD[\n]HH:mm');
      };
      timeFormatterStr = 'HH:mm  MM-DD';
    } else if(range > 1501 && range <= 10501) {

      // 1周数据，7 * 25 * 60 + 1
      interval = 30 * 60 * 60;  // 30小时
      formatter = function(value) {
        return moment(value).format('MM-DD[\n]HH:mm');
      };
      timeFormatterStr = 'MM-DD HH:mm';
    } else if(range > 10501 && range <= 46501) {

      // 1个月 31 * 25
      interval = 7 * 24 * 60 * 60;  // 一周
      formatter = function(value) {
        return moment(value).format('MM-DD');
      };
      timeFormatterStr = 'MM-DD';
    } else if(range > 46501) {

      interval = 20 * 7 * 24 * 60 * 60;  // 20天
      formatter = function(value) {
        return moment(value).format('YY-MM-DD');
      };
      timeFormatterStr = 'YY-MM-DD';
    }

    return {
      formatter,
      interval: interval * 1000,
      timeFormatterStr
    };
  }

  onSelectChange(key) {
    if(key === 'real_time') {
      this.startTimer();
    } else {
      this.clearTimer();
    }
    request.getBandwidthData(key).then(res => {
      this.updateOption(res);
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getBandwidthData('real_time').then(res => {
        this.updateOption(res);
      });
    }, 5000);
  }

  clearTimer() {
    if(this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  render() {
    const { __ } = this.props;
    return (
      <div className="bandwidth-card">
        <div className="bandwidth-card-title" ref={(elem) => this.popupContainer = elem}>
          <span>{__.bandwidth}</span>
          <Select defaultValue={selectCfg.defaultValue} onChange={this.onSelectChange}
            style={{width: 120}} getPopupContainer={() => {
              return this.popupContainer;
            }} showArrow={false}>
            {
              selectCfg.data.map((item, idx) => {
                return (
                  <Option value={item.value} key={item.value}>
                    {__[item.label] || item.label}
                  </Option>
                );
              })
            }
          </Select>
          <Icon type="caret-down-right" />
        </div>
        <div className="bandwidth-card-line-chart" ref={elem => this.divElem = elem}></div>
      </div>
    );
  }
}

export default BandwidthCard;
