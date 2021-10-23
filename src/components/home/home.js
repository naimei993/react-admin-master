import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import cloneDeep from 'lodash.clonedeep';
import { Card ,Steps,Carousel} from 'antd';
import './home.min.css'
import img1 from '../../static/img/img1.jpg'
import img2 from '../../static/img/img2.jpg'
import img3 from '../../static/img/img3.jpg'
import img4 from '../../static/img/img4.jpg'
const { Step } = Steps;
const Home = () => {
  const DEFAULT_OPTION = {
    title: {
      text:'销量图',
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data:['最新成交价', '预购队列']
    },
    toolbox: {
      show: true,
      feature: {
        dataView: {readOnly: false},
        restore: {},
        saveAsImage: {}
      }
    },
    grid: {
      top: 60,
      left: 30,
      right: 60,
      bottom:30
    },
    dataZoom: {
      show: false,
      start: 0,
      end: 100
    },
    visualMap: {
      show: false,
      min: 0,
      max: 1000,
      color: ['#BE002F', '#F20C00', '#F00056', '#FF2D51', '#FF2121', '#FF4C00', '#FF7500',
        '#FF8936', '#FFA400', '#F0C239', '#FFF143', '#FAFF72', '#C9DD22', '#AFDD22',
        '#9ED900', '#00E500', '#0EB83A', '#0AA344', '#0C8918', '#057748', '#177CB0']
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: (function (){
          let now = new Date();
          let res = [];
          let len = 50;
          while (len--) {
            res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
            now = new Date(now - 2000);
          }
          return res;
        })()
      },
      {
        type: 'category',
        boundaryGap: true,
        data: (function (){
          let res = [];
          let len = 50;
          while (len--) {
            res.push(50 - len + 1);
          }
          return res;
        })()
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: '价格',
        max: 20,
        min: 0,
        boundaryGap: [0.2, 0.2]
      },
      {
        type: 'value',
        scale: true,
        name: '预购量',
        max: 1200,
        min: 0,
        boundaryGap: [0.2, 0.2]
      }
    ],
    series: [
      {
        name:'预购队列',
        type:'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            barBorderRadius: 4,
          }
        },
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return idx * 10;
        },
        animationDelayUpdate: function (idx) {
          return idx * 10;
        },
        data:(function (){
          let res = [];
          let len = 50;
          while (len--) {
            res.push(Math.round(Math.random() * 1000));
          }
          return res;
        })()
      },
      {
        name:'最新成交价',
        type:'line',
        data:(function (){
          let res = [];
          let len = 0;
          while (len < 50) {
            res.push((Math.random()*10 + 5).toFixed(1) - 0);
            len++;
          }
          return res;
        })()
      }
    ]
  };
  const contentStyle = {
    height: '350px',
    width:'100%'
  };
  let count;

  const [option, setOption] = useState(DEFAULT_OPTION);

  function fetchNewData() {
    const axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
    const newOption = cloneDeep(option); // immutable
    newOption.title.text = 'Hello Echarts-for-react.' + new Date().getSeconds();
    const data0 = newOption.series[0].data;
    const data1 = newOption.series[1].data;
    data0.shift();
    data0.push(Math.round(Math.random() * 1000));
    data1.shift();
    data1.push((Math.random() * 10 + 5).toFixed(1) - 0);

    newOption.xAxis[0].data.shift();
    newOption.xAxis[0].data.push(axisData);
    newOption.xAxis[1].data.shift();
    newOption.xAxis[1].data.push(count++);

    setOption(newOption);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      fetchNewData();
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div className="all">
      <div className="top">
      <div className="top-left">
      <Card title="商品总量"style={{ width: 300,marginTop:10,marginLeft:10}}>
      <p style={{fontSize:20,fontWeight:800,lineHeight:2}}>1,128,163个</p>
      <p>周同比15%</p>
      <p>日同比10%</p>
    </Card>
        </div>
        <div className="top-center">
        <Carousel autoplay>
    <div>
      <img  style={contentStyle}src={img1} alt="img"/>
    </div>
    <div>
    <img style={contentStyle} src={img2} alt="img"/>
    </div>
    <div>
    <img style={contentStyle} src={img3} alt="img"/>
    </div>
    <div>
    <img style={contentStyle} src={img4} alt="img"/>
    </div>
  </Carousel>,
        </div>
        <div className="top-right">
        <Card title="任务进展"style={{ width: 300 }}>
        <Steps progressDot current={1} direction="vertical">
      <Step title="新版本迭代会" />
      <Step status='finish' title="完成网站设计初版" />
      <Step status='process' title="联调接口" description="功能验收" />
      <Step status='error' title="登录功能设计" description="验证权限"/>
      <Step status='wait' title="页面排版"/>
      <Step status='wait' title="UI设计"/>
      <Step status='wait' title="代码编程"/>
      <Step status='wait' title="测试功能"/>

      </Steps>
      </Card>
        
      </div>
      </div>
  <ReactECharts
    option={option}
    style={{ height: '50%',width:'82%',marginTop:20}}
  />

    </div>
  )
  
  
};

export default Home;