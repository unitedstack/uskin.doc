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

class IOPSCard extends React.Component {
  constructor(props) {
    super(props);

    this.chart = null;
    this.timer = null;
    this.popupContainer = null;
    this.divElem = null;
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

    // 200 是未折叠侧边栏宽度，80是折叠后的宽度
    // 0.74 是大屏情况下线图所占容器的宽度比例
    // 0.5 是小屏情况下的比例
    // 比例都写在了 CSS 文件中，如果要修改记得这里和 CSS 都要修改
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
    const names = ['read_iops', 'write_iops', 'recovery_iops'];
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

    this.chart.setOption({
      title: ['read', 'write', 'recovery'].map(se => {
        const latest = data[se].length !== 0 ? data[se][data[se].length-1][1] : 0;
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
              '</span>' + params[index].data[1] + '</div>';
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
          name: se + '_iops',
          data: data[se].map(d => {
            return [
              d[0] * 1000,
              d[1]
            ];
          })
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
    request.getIOPSData(key).then(res => {
      this.updateOption(res);
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      request.getIOPSData('real_time').then(res => {
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
      <div className="iops-card">
        <div className="iops-card-title" ref={(elem) => this.popupContainer = elem}>
          <span>{__.iops}</span>
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
        <div className="iops-card-line-chart" ref={elem => this.divElem = elem}></div>
      </div>
    );
  }
}

export default IOPSCard;
