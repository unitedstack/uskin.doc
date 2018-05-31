import './style/index.less';

import React, {Component} from 'react';
import LineChart from 'client/components/new_line_chart/index';

import request from '../../request';
import config from './config.json';
import clone from 'client/utils/deep_clone';
import unit from '../../../../utils/unit';

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


class Monitor extends Component {
  constructor(props){
    super(props);

    const chartsCfg = this.completeCfg(config.charts);

    //每个图表当前下拉框选中的时间段
    const selectedKeysMap = {};
    const timerMap = {};

    config.charts.forEach(cfg => {
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
   * 为每个图表补充完整配置
   * @param {array} chartsCfg
   */
  completeCfg(chartsCfg) {
    chartsCfg.forEach(chartCfg => {
      chartCfg.__ = this.props.__;
      chartCfg.select = selectCfg;
      chartCfg.onInitialize = this.onChartInitialize.bind(this, chartCfg.key);
      chartCfg.onChange = this.onChartSelectChange.bind(this, chartCfg.key);
    });
    return chartsCfg;
  }

  onChartInitialize(chartKey) {
    let selectedKey = this.state.selectedKeysMap[chartKey];
    //感觉下面这个if不会用到吧...
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
  }



  /**
   * 请求图表的监控数据
   * @param {string} chartKey 请求数据的图表的 key 值
   * @param {string} selectedKey 请求数据的图表的当前选择战士时间段的 key 值
   */
  getMonitorData(chartKey, selectedKey) {
    const { chartsCfg } = this.state;
    const wwn = this.props.wwn;
    let chartCfgIndex;

    const chartCfg = chartsCfg.find((cfg, index) => {
      if(cfg.key === chartKey){
        chartCfgIndex = index;
        return true;
      }
      return false;
    });

    const copy = clone(chartCfg);

    /**
     * 这个函数用来调整小数位数并更新状态
     * @param {function} getDataFunc 执行ajax操作的函数
     * @param {function} fixFunc 修正数据格式的函数
     * @param {object} context 执行上下文
     */
    function handleData(getDataFunc, fixFunc, context){
      return (
        getDataFunc(wwn, selectedKey).then(res => {
          let unitMax = fixFunc(res, copy.data);
          let _fixFunc = fixFunc === Number ? Number : unit['bytesTo' + unitMax];

          copy.data.forEach(item => {
            let response = Array.isArray(res) ? res : res[item.key];

            item.data = response.map(resItem => {
              return [
                resItem[0],
                _fixFunc(resItem[1]).toFixed(2)
              ];
            });
          });

          if (fixFunc !== Number) copy.chartOpt.yAxisUnit = unitMax + '/s';
          chartsCfg[chartCfgIndex] = copy;
          context.setState({
            chartsCfg: chartsCfg
          });
        })
      );
    }

    switch (chartKey){
      case 'iops':
        handleData(request.getIOPSMonitorData, Number, this);
        break;
      case 'bandwidth':
        handleData(request.getBandwidthMonitorData, unit.unitFix, this);
        break;
      case 'wait':
        handleData(request.getIOWaitMonitorData, Number, this);
        break;
      case 'service':
        handleData(request.getIOServiceMonitorData, Number, this);
        break;
      case 'rate':
        handleData(request.getIORateMonitorData, Number, this);
        break;
      default:
        break;
    }
  }

  onChartSelectChange(chartKey, selectedKey){
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

  render(){
    const { chartsCfg } = this.state;

    return (
      <div className="uds-server-detail-monitor-wrapper">
        <ul>
          {
            chartsCfg.map((chartCfg, index) => {
              return (
                <li key={chartCfg.key}>
                  <LineChart {...chartCfg} />
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