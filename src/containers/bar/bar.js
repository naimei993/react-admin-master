import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
export default class Bar extends Component {
    render() {
      const option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data:['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };
        return (
          <ReactECharts
          option={option}
          style={{ height: 400 }}
          opts={{ renderer: 'svg' }}
        />
        )
    }
}
