import React,{Component} from 'react'
import {Card,Button,Table, message,Modal,Form,Input,Select} from 'antd';
import dayjs from 'dayjs'
import  { PlusOutlined } from '@ant-design/icons'
import {reqUserList,reqAddUser,reqUpdateUser,reqDeleteUser} from '../../api/index'
import {PAGE_SIZE} from '../../config'
const {Item} = Form
const {Option} = Select

class User extends Component{

  state = {
    isShowAdd:false, //是否展示新增弹窗
    userList:[],//用户列表
    roleList:[],//角色列表
    operType:'',
    isModalVisible:false,
    user_email:'',
    user_phone:'',
    role_id:'',
    user_name:'',
    _id:'',
  }
  formRef = React.createRef()
  getUserList = async()=>{
    let result = await reqUserList()
    const {status,data,msg} = result
    if(status === 0) this.setState({
      userList:data.users.reverse(),
      roleList:data.roles
    })
    else message.err(msg,3)
  }

  componentDidMount(){
    this.getUserList()
  }

  //新增用户弹窗----确定按钮回调
  handleOk = ()=>{
    const {operType} = this.state
    this.formRef.current.validateFields()
    .then( values => {
      values.password = this.state.password
        console.log(values,"表单values");
        if(operType === 'add') this.toAdd(values)
         if(operType === 'update'){
            values._id = this.state._id
             console.log(values,"AAAAAAAAA");
             this.toUpdate(values);
         } 
    })
    .catch(info => {
        console.log('Validate Failed:', info);
    });
  }
  clickUpdate = (item)=>{
    console.log(item);
    const{_id,email,phone,role_id,username,password} = item
    this.setState({
      user_email:email,
      _id:_id,
      password:password,
      user_name:username,
      role_id:role_id,
      user_phone:phone,
      isShowAdd:true,
      operType:'update'
    })
    if(this.formRef.current === null){
      console.log("空的");
  }else{
      this.formRef.current.setFieldsValue({email,phone,role_id,username})//调用setFieldsValue方法动态修改分类的值
  }
}
  //更新操作
  toUpdate = async (user)=>{//箭头函数
        let result = await reqUpdateUser(user)
        const {status,data,msg} = result
        let data1 = [result.data]
        console.log(result);
        if(status === 0){
          message.success('更新用户成功')
          let userList = [...this.state.userList]
          let add = userList.filter(item => !data1.some(ele=>ele._id===item._id));
          userList = [data,...add]
          this.setState({userList,isShowAdd:false})
        }else{
          message.error(msg,1)
        }
  }
  clickAdd = ()=>{//箭头函数
    if(this.formRef.current !== null){
      this.formRef.current.setFieldsValue({email:'',phone:'',role_id:'',username:'',password:''})
    }
    this.setState({isShowAdd:true,operType:'add'});
  }
  //新增操作
  toAdd = async(values)=>{//箭头函数
    let result = await reqAddUser(values)
    console.log(values);
    const {status,data,msg} = result
    if(status===0){
      message.success('添加用户成功')
      let userList = [...this.state.userList]
      userList.unshift(data)
      this.setState({userList,isShowAdd:false})
    }
    else message.error(msg,1)
  }
  clickDelete = (item)=>{//箭头函数
    const {username,_id} = item
      this.setState({isModalVisible:true,user_name:username,_id:_id})
  }
  //删除用户id
  toDelete = async (_id)=>{
    let result = await reqDeleteUser(_id)
    const {status,msg} = result
    if(status===0){
      message.success('删除用户成功')
      this.setState({isShowAdd:false})
      this.getUserList()
    }
    else message.error(msg,1)
  }
  //新增用户弹窗----取消按钮回调
  handleCancel = ()=>{
    this.setState({isShowAdd:false})
  }
  handleOkModal = ()=>{
    this.setState({isModalVisible:false})
    console.log(this.state._id);
    this.toDelete(this.state._id)
  }
  handleCancelModal = ()=>{
    this.setState({isModalVisible:false})
  }
  render(){
    const dataSource = this.state.userList
    console.log(dataSource,"dataSource");
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
      },
      {
        title: '操作',
        key: 'option',
        render: (item) => (
          <div>
            <Button 
              type='link' 
              onClick={()=>{this.clickUpdate(item)}}
             >修改
            </Button>
            <Button 
              type='link' 
              onClick={()=>{this.clickDelete(item)}}
             >删除
            </Button>
            <Modal destroyOnClose okText="确定" cancelText="取消" title={`删除${this.state.user_name}`} visible={this.state.isModalVisible} onOk={this.handleOkModal} onCancel={this.handleCancelModal}>
                            <p style={{fontSize:'20px',fontWeight:'500'}}>确定删除<span style={{color:'red'}}>{this.state.user_name}?</span></p>
                            
                </Modal>
          </div>
          )
      }
    ];
    
    return (
      <div>
        <Card
          title={
            <Button type='primary' onClick={this.clickAdd}>
              < PlusOutlined/>创建用户
            </Button>
          }
        >
          <Table 
            dataSource={dataSource} 
            columns={columns}
            bordered
            pagination={{defaultPageSize:PAGE_SIZE}}
            rowKey="_id"
          />
        </Card>
        {/* 新增角色提示框 */}
        <Modal
          title={this.state.operType === 'add' ? '新增用户' :'更新用户'} 
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form 
          labelCol={{span:4}} 
          wrapperCol={{span:16}}
          ref={this.formRef}
          >
            <Item 
            label="用户名"
            name="username"
            initialValue={this.state.user_name}
            rules={[{required: true, message: '用户名必须输入' },]}
            >
              <Input placeholder="请输入用户名"/>
            </Item>
            <Item label="密码"
            name="password"
            rules={[{required:this.state.operType === 'add' ? true :false, message: '密码必须输入' },]}
            >
              <Input disabled={this.state.operType === 'add' ? false :true} placeholder={this.state.operType === 'add' ? "请输入密码" :''}/>
            </Item>
            <Item label="手机号"
             name="phone"
             initialValue={this.state.user_phone}
             rules={[{required: true, message: '手机号必须输入' },]}
            >
              <Input placeholder="请输入手机号"/>
            </Item>
            <Item label="邮箱"
            name="email"
            initialValue={this.state.user_email}
            rules={[{required: true, message: '邮箱必须输入' },]}
            >
              <Input placeholder="请输入邮箱"/>
            </Item>
            <Item label="角色"
             name="role_id"
             initialValue={this.state.role_id}
             rules={[{required: true, message: '必须选择一个角色' },]}
             >
                <Select>
                  <Option value=''>请选择一个角色</Option>
                  {
                    this.state.roleList.map((item)=>{
                      return <Option key={item._id} value={item.name}>{item.name}</Option>
                    })
                  }
                </Select>
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default User