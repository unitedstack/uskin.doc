import './style/index.less';

import React from 'react';
import LineChart from 'client/components/new_line_chart/index';

import request from '../../request';
import config from './config.json';
import clone from 'client/utils/deep_clone';
import unit from '../../../../utils/unit';

// 通用的图表下拉框配置项
const selectCfg = {
  defaultValue: 'within_three_hours',
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

class Monitor extends React.Component {
  constructor(props) {
    super(props);

    const chartsCfg = this.completeCfg(config.charts);

    // 每个图表当前下拉框选中的时间段 key map
    const selectedKeysMap = {};
    const timerMap = {};

    config.charts.forEach((cfg) => {
      selectedKeysMap[cfg.key] = cfg.select.defaultValue;
      timerMap[cfg.key] = null;
    });

    this.state = {
      chartsCfg,
      selectedKeysMap
    };

    this.timerMap = timerMap;
  }

  /**
   * 为每个图表配置项补充完整的配置
   * @param {array} chartsCfg
   */
  completeCfg(chartsCfg) {
    chartsCfg.forEach((chartCfg) => {
      if(config.initialDelay) {
        chartCfg.initialDelay = config.initialDelay;
      }
      chartCfg.__ = this.props.__;
      chartCfg.select = selectCfg;
      chartCfg.onInitialize = this.onChartInitialize.bind(this, chartCfg.key);
      chartCfg.onChange = this.onChartSelectChange.bind(this, chartCfg.key);
    });

    return chartsCfg;
  }

  onChartInitialize(chartKey) {
    let selectedKey = this.state.selectedKeysMap[chartKey];
    if(selectedKey === 'real_time') {
      this.startTimer(chartKey);
    }
    this.getMonitorData(chartKey, selectedKey);
  }

  startTimer(chartKey) {
    if(this.timerMap[chartKey]) {
      return;
    }

    this.timerMap[chartKey] = setInterval(() => {
      this.getMonitorData(chartKey, 'real_time');
    }, 5000);
  }

  clearTimer(chartKey) {
    clearInterval(this.timerMap[chartKey]);
    this.timerMap[chartKey] = null;
  }

  componentWillUnmount() {
    for(let key in this.timerMap) {
      this.clearTimer(key);
    }
    this.setState = (state,callback)=>{
      return;
    };
  }


  /**
   * 请求图表的监控数据
   * @param {string} chartKey 请求数据的图表的 key 值
   * @param {string} selectedKey 请求数据的图表的当前选择展示时间段的 key 值
   */
  getMonitorData(chartKey, selectedKey) {
    const { chartsCfg } = this.state;
    const { user, bucket } = this.props;
    let chartCfgIndex;      // 保存一个索引，方便后面的赋值

    const chartCfg = chartsCfg.find((cfg, index) => {
      if(cfg.key === chartKey) {
        chartCfgIndex = index;
        return true;
      }
      return false;
    });

    // 这里之所以针对副本做修改是因为，如果直接修改 chartCfg
    // 很容易在图表的 shouldUpdateComponent 导致 this.props
    // 与nextProps 相等，导致组件无法更新
    const copy = clone(chartCfg);

    switch (chartKey) {
      case 'upload_total':
        request.getUploadTotal(user, bucket, selectedKey).then(res => {
          let unitMax = unit.unitFix(res);

          copy.chartOpt.yAxisUnit = unitMax;
          copy.data.forEach(item => {
            item.data = res.map(resItem => {
              return [
                resItem[0],
                unit['bytesTo' + unitMax](resItem[1]).toFixed(2)
              ];
            });
          });

          chartsCfg[chartCfgIndex] = copy;
          this.setState({
            chartsCfg: chartsCfg
          });
        });
        break;
      case 'download_total':
        request.getDownloadTotal(user, bucket, selectedKey).then(res => {
          let unitMax = unit.unitFix(res);

          copy.chartOpt.yAxisUnit = unitMax;
          copy.data.forEach(item => {
            item.data = res.map(resItem => {
              return [
                resItem[0],
                unit['bytesTo' + unitMax](resItem[1]).toFixed(2)
              ];
            });
          });

          chartsCfg[chartCfgIndex] = copy;
          this.setState({
            chartsCfg: chartsCfg
          });
        });
        break;
      default:
        break;
    }
  }

  onChartSelectChange(chartKey, selectedKey) {
    const { selectedKeysMap } = this.state;
    if(selectedKeysMap[chartKey] === 'real_time') {
      this.clearTimer(chartKey);
    } else if(selectedKey === 'real_time') {
      this.startTimer(chartKey);
    }

    selectedKeysMap[chartKey] = selectedKey;
    this.setState({
      selectedKeysMap
    });

    this.getMonitorData(chartKey, selectedKey);
  }

  render() {
    const { chartsCfg } = this.state;

    return (
      <div className="storage-bucket-monitor-wrapper">
        <ul>
          {
            chartsCfg.map((chartCfg, index) => {
              return (
                <li key={chartCfg.key}>
                  {<LineChart {...chartCfg} />}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}


export default Monitor;
