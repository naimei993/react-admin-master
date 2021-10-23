import {SAVE_USER_INFO,DELETE_USER_INFO} from '../action_types'

//尝试从localStorage中读取之前保存的信息
let user = JSON.parse(localStorage.getItem('user'))
let token = localStorage.getItem('token')
let role = localStorage.getItem('role')
//初始化userInfo数据
let initState = {
  //若有值，取出使用，没有值，为空
  user: user || '',
  token: token || '',
  role:role || '',
  isLogin: user && token ? true :false
}

export default function test(preState=initState,action) {
  const {type,data} = action
  console.log(data,"AAAAAAAAAAAAA");
  let newState
  switch (type) {
    case SAVE_USER_INFO: //保存user和token
      const {token} = data 
      const menus = data.data.role.menus || ''
      const user = data.data.username
      newState = {user,role:menus,token,isLogin:true}
      return newState
    case DELETE_USER_INFO://删除user和token
      newState = {user:'',role:'',token:'',isLogin:false}
      return newState
    default:
      return preState
  }
}