import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button,message  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Redirect} from 'react-router-dom'
// import axios from 'axios'
import {createSaveUserInfoAction} from '../../redux/action_creators/login_action'
import { reqLogin } from '../../api/index';
import logo from '../../static/img/logo.png'
import './css/login.min.css'
class Login extends Component {
  //密码验证器
  pwdvalidator  = (rule,value,callback)=>{//箭头函数
    if(!value){
      return Promise.reject('密码必须输入');
    }else if(value.length < 2){
      return Promise.reject('密码长度必须大于等于2')
    }
    else if(value.length > 15){
      return Promise.reject('密码长度必须小于15')
    }else if(!(/^\w+$/).test(value)){
      return Promise.reject('密码只能包含字母数字下划线字符')
    }else{
      return Promise.resolve();
    }
}

     onFinish = async(values) => {
            const {username,password} = values;
            let result = await reqLogin(username,password)
            const {status,msg} = result;
            if(status === 0){
             //1.服务器返回的user信息，还有token交由redux管理
             this.props.saveUserInfo(result)
              //2.跳转admin页面
              this.props.history.push('/admin/home');
              message.success("登陆成功")
                
            }else {
              message.warning(msg,2)
            }
          };
  render() {
        const {isLogin} =this.props;
          if(isLogin){
            return <Redirect to="/admin"/>
          }
        return (
            <div className="login">
                <header>
                     <img src={logo} alt="logo"/>
                     <h1>登录界面</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
    <Form
        name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={this.onFinish}
    >
      <Form.Item
         name="username"
         rules={[{ required: true, message: '请输入您的用户名!' }]}
       >
         <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="password"
         rules={[
           {
             validator:this.pwdvalidator,
           }
      //     {
      //       required: true,
      //       message: '请输入你的密码!',
      //     },
      //     {
      //       pattern: /^\w+$/,
      //       message: '密码只能包含字母数字下划线字符',
      //   },
      //   {
      //     max: 15,
      //     message: '密码最长10位',
      // },
      // {
      //     min: 5,
      //     message: '密码至少5位',
      // }, 
         ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Form.Item>
    </Form>
                </section>
            </div>
        )
    }
}
const mapStateToProps = (state)=>{
  return {
      isLogin:state.userInfo.isLogin
  }
}
// const mapDispatchToProps = () => {
//   return {
//     saveUserInfo:createSaveUserInfoAction,
//   }
// };
export default connect(
  mapStateToProps,{saveUserInfo:createSaveUserInfoAction,}
)(Login)
// export default connect(
//   state => ({isLogin:state.userInfo.isLogin}),
//   {saveUserInfo:createSaveUserInfoAction,}
// )(Login)