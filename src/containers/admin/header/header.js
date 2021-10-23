import React, { Component } from 'react'
import {FullscreenOutlined,FullscreenExitOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import screenfull from 'screenfull';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import dayjs from 'dayjs'
import { Modal, Button} from 'antd';
import './css/header.min.css'
import menuList from '../../../config/menu_config';
import {reqWheather} from '../../../api/index'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
const { confirm } = Modal;
@withRouter
class Header extends Component {
    state = {
        isFull:false,
        date:dayjs().format(' YYYY年MM月DD日 HH:mm:ss'),
        weather:{},
        title:""
    }
    getWeather = async()=>{
        let result = await reqWheather()
        this.setState({weather:result.data.forecast[0]})
    }
    componentDidMount(){
        //给screenfull绑定监听
        screenfull.on('change', () => {
            let isFull = !this.state.isFull
            this.setState({isFull})
        });
        this.timeID = setInterval(()=>{//箭头函数
              this.setState({date:dayjs().format(' YYYY年MM月DD日 HH:mm:ss')})
        },1000)
        this.getWeather()
        this.getTitle()
        
    }
    componentWillUnmount(){
        //清除更新时间定时器
        clearInterval(this.timeID)
      }
    //切换全屏按钮的回调
    fullScreen = ()=>{//箭头函数
        screenfull.toggle()
    }
    //上方标题
    getTitle =()=>{//箭头函数
          let pathkey = this.props.location.pathname.indexOf('product') !== -1 ? 'product' :this.props.location.pathname.split('/').reverse()[0]
          let title = ''
          menuList.forEach((item)=>{//箭头函数
                if(item.children instanceof Array){
                    let tmp = item.children.find((item2)=>{//箭头函数
                          return item2.key === pathkey
                    })
                    if(tmp) title = tmp.title
                }else{
                    if(pathkey === item.key) title = item.title
                }
          })
          this.setState({title})
    }
    logout=()=>{//退出登录函数
        let {deleteUserInfo} = this.props
        confirm({
            title: '确定退出登录？',
            icon: <ExclamationCircleOutlined />,
            cancelText:'取消',
            okText:'确定',
            content: '若退出则需要重新输入账号密码用以登录',
            onOk() {
                deleteUserInfo()
            },
          });
        
  }
    render() {
        let {isFull,weather} = this.state
        const low = String(weather.low).substring(2)
        const height =String(weather.high).substring(2)
        const {user}=  this.props.userInfo
        return (
            <header className="header">
                <div className="header-top">
                    <Button size="small" onClick={this.fullScreen}>
                    {isFull ? <FullscreenExitOutlined/>:<FullscreenOutlined />  }
                    </Button>
                    <span className="username">欢迎,{user}</span>
                    <Button type="link"size="small" onClick = {this.logout}>退出登录</Button>
                </div>
                <div className="header-bottom">
                <div className="header-bottom-left">
                    {this.props.title || this.state.title}
                    </div>
                <div className="header-bottom-right">
                    {this.state.date}
                    <img src="https://p7.itc.cn/q_70/images03/20210203/562a12a8cbc840dba5c327db641a097c.png" alt="天气信息"/>
                    {weather.type} {low}~{height}
                    
                </div>
                </div>
            </header>
        )
    }
}



const mapStateToProps = (state)=>({
    userInfo:state.userInfo,
    title:state.title
})
export default connect(
mapStateToProps,
{deleteUserInfo:createDeleteUserInfoAction}
)(Header)