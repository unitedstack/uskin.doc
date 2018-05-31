import './style/index.less';
import React from 'react';
import echarts from 'client/libs/chart/index';
import utilConverter from '../../../../utils/unit_converter';

const chartCfg = {
  chartOpt: {
    subtitle: {
      text: 'total_d',
      value: 0,
    },
    orient: 'horizontal'
  },
  data: [{
    name: {
      text: 'used',
      value: 0,
    },
    color: '#01AFC9',
    data: [0]
  }, {
    name: {
      text: 'unused',
      value: 0,
    },
    color: '#C7CBD0',
    data: [0]
  }]
};

class CapacityUseChart extends React.Component {
  constructor(props) {
    super(props);

    this.chart = null;
  }

  componentDidMount() {
    const { __, data } = this.props;
    const total = utilConverter(data.kb, 'KB'),
      used = utilConverter(data.kb_used, 'KB'),
      unused = utilConverter(data.kb_avail, 'KB');

    chartCfg.chartOpt.subtitle.value = total.num;
    chartCfg.chartOpt.subtitle.unit = total.unit;
    chartCfg.data[0].data = [data.kb_used];
    chartCfg.data[0].name.value = used.num;
    chartCfg.data[0].name.unit = used.unit;
    chartCfg.data[1].data = [data.kb_avail];
    chartCfg.data[1].name.value = unused.num;
    chartCfg.data[1].name.unit = unused.unit;
    this.chart = echarts.$$init(this.divElem);
    this.chart.$$setOption('bar', chartCfg.chartOpt, chartCfg.data, __);
    // 校正位置
    this.chart.setOption({
      title: {
        top: 0,
        left: 20,
        itemGap: 16
      },
      grid: {
        width: '40%',
        top: 37,
        left: 130
      },
      legend: [{
        left: '55%',
        top: 31
      }, {
        left: '73%',
        top: 31
      }]
    });
  }

  render() {
    return (
      <div className="osd-detail-capacity-use-chart-wrapper">
        <div className="title">{this.props.__.capacity_use}</div>
        <div className="osd-capacity-use-bar-chart" ref={(elem) => this.divElem = elem }></div>
      </div>
    );
  }
}

export default CapacityUseChart;
