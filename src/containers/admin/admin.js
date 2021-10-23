import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Redirect,Route,Switch} from 'react-router';
import {Layout } from 'antd';
import Header  from './header/header';
import {createDeleteUserInfoAction} from '../../redux/action_creators/login_action'
import {reqCategoryList} from '../../api/index'
import './css/admin.min.css'
import LeftNav from './left_nav/left_nav';
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import Detail from '../product/detail'
import AddUpdate from '../product/add_update'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'
const { Footer, Sider, Content } = Layout;
class Admin extends Component {
    //在runder里，若想实现跳转，最好用<Redirect>
    logout=()=>{//箭头函数
          this.props.deleteUserInfo();
          return <Redirect  to="/login"/>
    }
   demo = async()=>{
    let result = await reqCategoryList()
    console.log(result);
   }
   
    render() {
        const {isLogin} = this.props.userInfo;
        if(!isLogin){//判断用户是否登陆，未登录返回登录页面
            return <Redirect  to="/login"/>
        }else{
            return (
                    <Layout className="admin">
                    <Sider className="sider"><LeftNav /></Sider>
                    <Layout>
                        <Header className="header">Header</Header>
                        <Content className="content">
                        <Switch>
                <Route path="/admin/home" component={Home}/>
                <Route path="/admin/prod_about/category" component={Category}/>
                <Route path="/admin/prod_about/product" component={Product} exact/>
                <Route path="/admin/prod_about/product/detail/:id" component={Detail}/>
                <Route path="/admin/prod_about/product/add_update" component={AddUpdate} exact/>
                <Route path="/admin/prod_about/product/add_update/:id" component={AddUpdate}/>
                <Route path="/admin/user" component={User}/>
                <Route path="/admin/role" component={Role}/>
                <Route path="/admin/charts/bar" component={Bar}/>
                <Route path="/admin/charts/line" component={Line}/>
                <Route path="/admin/charts/pie" component={Pie}/>
                <Redirect to="/admin/home"/>
              </Switch>

                        </Content>
                        <Footer className="footer">推荐使用谷歌浏览器，获取最佳用户体验
                        </Footer>
                    </Layout>
                    </Layout>
            
                
            )
        }
        
    }
}
const mapStateToProps = (state)=>({
    
        userInfo:state.userInfo
    
})
// const mapDispatchToProps = () => {
//     return {
//         deleteUserInfo:createDeleteUserInfoAction,
//     }
// }
// export default connect(
//     mapStateToProps,mapDispatchToProps
//   )(Admin)
export default connect(
    // state => ({userInfo:state.userInfo}),
    mapStateToProps,
    {deleteUserInfo:createDeleteUserInfoAction}
  )(Admin)
