import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Pie extends Component {
    state = {
        count:0,
    }
    
    render() {
        const option = {
            backgroundColor: '#fef4a9',
            title : {
              text: '某站点用户访问来源',
              subtext: '纯属虚构',
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            series : [
              {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
              }
            ]
          };
        const option1 = {
            backgroundColor: '#f6d04d',
            title: {
              text: '饼图二',
              left: 'center',
              top: 20,
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                colorLightness: [0, 1]
              }
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                  { value: 335, name: 'Direct' },
                  { value: 310, name: 'Email' },
                  { value: 274, name: 'Union Ads' },
                  { value: 235, name: 'Video Ads' },
                  { value: 400, name: 'Search Engine' }
                ].sort(function (a, b) {
                  return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                  color: 'rgba(0, 0, 0)'
                },
                labelLine: {
                  lineStyle: {
                    color: 'rgba(0, 0, 0)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                },
                itemStyle: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                  return Math.random() * 200;
                }
              }
            ]
          };
          
        return (
            <div>
            <ReactECharts
              option={option}
              style={{ height: 400 }}
              onChartReady={this.onChartReady} 
            />   
                <ReactECharts
              option={option1}
              style={{ height: 400 }}
              onChartReady={this.onChartReady} 
            />   
            </div>
            
        )
    }
}
