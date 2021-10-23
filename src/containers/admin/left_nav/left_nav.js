import React, { Component } from 'react'
import { Menu} from 'antd';
import { Link,withRouter } from 'react-router-dom';
import  * as Icon from '@ant-design/icons';
import { connect } from 'react-redux';
import logo from '../../../static/img/logo.png'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'
import '../left_nav/left_nav.min.css'
import menuList from '../../../config/menu_config'


const { SubMenu } = Menu;
@connect(
  state =>({menus:state.userInfo.role,
  username:state.userInfo.user}),
  {
    saveTitle:createSaveTitleAction
  }
)
@withRouter
class LeftNav extends Component {
  hasAuth = (item)=>{//箭头函数
    const menus = this.props.menus
    const {username} = this.props
    const menusList = menus.toString().split(',')
    if(username === 'admin'){
      return true
    } 
    else if(!item.children){
        return menusList.find((item2)=>{return item2 === item.key})
      }
    else if(item.children){
        return item.children.some((item3)=>{return menusList.indexOf(item3.key) !== -1})
      }
    
    }
      createMenu = (target)=>{//箭头函数
        return (target.map((item)=>{//箭头函数
          if(this.hasAuth(item)){
          if(!item.children){
            return(
            <Menu.Item key={item.key} onClick={()=>{this.props.saveTitle(item.title)}}>
              <span>{
                React.createElement(
                  Icon[item.icon]
                )
              }</span>
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
            )}else{
              return(
  <SubMenu key={item.key} icon={React.createElement(Icon[item.icon])} title={<span>{item.title}</span>}>
    {
      this.createMenu(item.children)
    }
    
  </SubMenu> 
              )
            }
          }
          else{
            return false
          }
    }))
      }
      render() {
        const {pathname} = this.props.location
        return (
          <div >
              <header className="nav-header">
                  <img src={logo} alt=""/>
                  <h1>商品管理系统</h1>
              </header>
            <Menu
              selectedKeys={pathname.indexOf('product') !== -1 ? 'product' :pathname.split('/').reverse()[0]}
              defaultOpenKeys={pathname.split('/').splice(2)}
              mode="inline"
              theme="dark"
            >
              {
                this.createMenu(menuList)
              }
            </Menu>
          </div>
        );
      }
}
export default LeftNav