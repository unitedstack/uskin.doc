const commonTitleCfg = {
  top: 28,
  padding: 0,
  text: 0,
  textStyle: {
    fontSize: 28,
    color: '#393C40',
    fontWeight: 'normal'
  }
};

const commonLegendCfg = {
  show: true,
  top: 75,
  itemWidth: 30,
  itemHeight: 2,
  padding: 0,
  selectedMode: false,
  icon: 'roundRect',
  textStyle: {
    color: '#393C40',
    fontSize: 12,
    padding: [0, 0, 0, 13]
  }
};

const commonTooltipCfg = {
  padding: 0,
  backgroundColor: 'transparent',
  position: function(point) {
    return [point[0] - 23, point[1] - 60];
  }
};

const commonSeriesCfg = {
  type: 'line',
  showSymbol: false,
  symbolSize: 4,
  xAxisIndex: 0,
  yAxisIndex: 0,
  smooth: true,
  tooltip: commonTooltipCfg
};

const chartOption = {
  textStyle: {
    fontFamily: 'Microsoft YaHei'
  },
  backgroundColor: '#fcfcfc',
  title: [
    {...commonTitleCfg, left: 30},
    {...commonTitleCfg, left: 180},
    {...commonTitleCfg, left: 325}
  ],
  tooltip: {
    trigger: 'axis',
    padding: 0,
    backgroundColor: 'transparent'
  },
  legend: [
    {...commonLegendCfg, left: 30},
    {...commonLegendCfg, left: 180},
    {...commonLegendCfg, left: 325}
  ],
  grid: {
    top: 113,
    right: 31,
    bottom: 52,
    left: 80
  },
  xAxis: {
    gridIndex: 0,
    type: 'time',
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#eaeaea'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      margin: 16,
      color: '#c1c1c1',
      fontSize: 12
    }
  },
  yAxis: {
    gridIndex: 0,
    type: 'value',
    splitNumber: 3,
    splitLine: {
      lineStyle: {
        color: '#eaeaea'
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      margin: 16,
      color: '#c1c1c1',
      fontSize: 12
    }
  },
  series: [
    {
      ...commonSeriesCfg,
      zlevel: 3,
      data:[],
      itemStyle: {
        color: '#01afc9'
      },
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#1dc4e9'
          }, {
            offset: 1,
            color: '#1de9b6'
          }]
        }
      },
      areaStyle: {
        color: 'rgba(4,215,198,.1)'
      }
    },
    {
      ...commonSeriesCfg,
      zlevel: 2,
      data: [],
      itemStyle: {
        color: '#5181EC'
      },
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#5181EC'
          }, {
            offset: 1,
            color: '#1DC4E9'
          }]
        }
      },
      areaStyle: {
        color: 'rgba(74,133,255,.1)'
      }
    },
    {
      ...commonSeriesCfg,
      zlevel: 1,
      data: [],
      itemStyle: {
        color: '#B461DB'
      },
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#B461DB'
          }, {
            offset: 1,
            color: '#1DC4E9'
          }]
        }
      },
      areaStyle: {
        color: 'rgba(227,196,242,.1)'
      }
    }
  ]
};

export default chartOption;