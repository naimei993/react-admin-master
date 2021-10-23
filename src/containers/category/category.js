import React, { Component } from 'react'
import { Card,Button,Table, message,Modal,Form,Input} from 'antd';
import{PlusOutlined} from '@ant-design/icons'
import {reqCategoryList,reqAddCategory,reqUpdateCategory,reqDeleteCategory,} from '../../api/index'
import {PAGE_SIZE} from '../../config/index'
import { connect } from 'react-redux';
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'
@connect(
    state =>({}),
    {saveCategory:createSaveCategoryAction}
)
 class Category extends Component {
    formRef = React.createRef()
    state = {
        categoryList:[],//商品分类列表
        visible:false,//控制弹窗展示或隐藏
        operType:'',//操作类型
        isLoading:true,//是否处于加载中
        modalCurrentValue:'',//弹窗内容展示--点击数据回显
        modalCurrentId:'',//
        isModalVisible:false,
        _id:'',

    }
    componentDidMount(){
        //渲染时获取商品列表
       this.getCategoryList()
    }
    //获取分类列表
    getCategoryList = async()=>{//箭头函数
        let result = await reqCategoryList();
        this.setState({isLoading:false})
        const {status,data} = result
        console.log(status,data);
        if(status===0) {
            this.setState({categoryList:data.reverse()})
            this.props.saveCategory(data)
        }
        
        else message.error('请求错误',1)
    }
    //展示弹窗
    showAdd = ()=>{
        if(this.formRef.current !== null){
            this.formRef.current.setFieldsValue({categoryName:""})
        }
        this.setState({
            operType:'add',
            modalCurrentValue:'',
            modalCurrentId:'',
            visible:true
        });
      
       
    };
    //更新分类列表
    showUpdate = (item)=>{
        const {_id,name} = item;
        this.setState({
            modalCurrentValue:name,
            modalCurrentId:_id,//解决第一次点击current为空，设置初始默认值
            operType:'update',
            visible:true
        });
        if(this.formRef.current === null){
            console.log("空的");
        }else{
            this.formRef.current.setFieldsValue({categoryName:name})//调用setFieldsValue方法动态修改分类的值
        }
       
    };
    //添加分类操作
    toAdd = async(values)=>{//箭头函数
          let result = await reqAddCategory(values)
          const {status,msg,data} = result
          if(status === 0){
            message.success('新增商品成功')
            const categoryList =[...this.state.categoryList]
            categoryList.unshift(data)
            this.setState({categoryList})
            //重置表单
           this.formRef.current.resetFields();
           this.setState({
               visible: false
           });
          }
          if(status === 1) message.error(msg,1)
    }
    //更新操作
    toUpdate = async(categoryObj)=>{//箭头函数
          let result = await reqUpdateCategory(categoryObj)
          const {status} = result
          if(status === 0){
           this.getCategoryList();
           this.setState({
               visible: false
           });
           this.formRef.current.resetFields();
           message.success('更新分类名成功',1)
          }else{
              
          }
    }
    //ok回调
    handleOk = ()=>{
       const {operType} = this.state
       this.formRef.current.validateFields()
       .then(values => {
           console.log(values,"表单values");
           if(operType === 'add') this.toAdd(values)
            if(operType === 'update'){
                const categoryId= this.state.modalCurrentId;
                const categoryName = values.categoryName;
                const categoryObj = {categoryId,categoryName}
                this.toUpdate(categoryObj);
            } 
       })
       .catch(info => {
           console.log('Validate Failed:', info);
       });    
    };
    //取消回调
    handleCancel = ()=>{
        this.setState({
            visible:false,
        });
         //重置表单
        this.formRef.current.resetFields()
    };
    //删除分类
    deleteCatory = async(categoryId)=>{//箭头函数
          let result = await reqDeleteCategory(categoryId)
          const {status} = result
          console.log(result);
          if(status === 0){
              message.success("删除成功",1)
              this.getCategoryList()
          }else{
              message.error("删除失败",1)
          }
    }
    showModal = (item) => {
        this.setState({isModalVisible:true,_id:item._id,productName:item.name})

      };
    
     deleteOk = () => {
        this.setState({isModalVisible:false})
        this.deleteCatory(this.state._id)
      };
    
      deleteCancel = () => {
        this.setState({isModalVisible:false})
      };
    
    render() {
        const dataSource = this.state.categoryList;
        
        let {operType,visible} = this.state
          const columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              //dataIndex:'categoryName',
              key: 'age',
              render:(item)=>{return(
                  <div>
                      <Button type="link" onClick={()=>{this.showUpdate(item)}}>修改分类</Button>
                      <Button type='link' onClick={()=>{this.showModal(item)}}>删除分类</Button>
                            <Modal keyboard destroyOnClose okText="确定" cancelText="取消" title={`删除${this.state.productName}`} visible={this.state.isModalVisible} onOk={this.deleteOk} onCancel={this.deleteCancel}>
                            <p style={{fontSize:'20px',fontWeight:'500'}}>确定删除<span style={{color:'red'}}>{this.state.productName}?</span></p>
                            
                             </Modal>
                  </div>
              )},
              width:"25%",
              align:'center'
            },
          ];
        return (
            <div>
            <Card
                extra={<Button onClick={this.showAdd} type="primary"><PlusOutlined />添加</Button>}
            >
               <Table 
               dataSource={dataSource}
               columns={columns} 
               bordered={true} 
               rowKey="_id"
               pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}
               loading={this.state.isLoading}
              
                />;
            </Card>

            <Modal 
            title={operType === 'add' ? '新增分类' :'修改分类'} 
            visible={visible}
            okText='确定'
            cancelText='取消'
            onOk={this.handleOk} 
            onCancel={this.handleCancel}
            >
            <Form
                ref={this.formRef}
                name="normal_login"
                className="login-form"
                initialValues={
                    {remember: true}
            }
            >
      <Form.Item
        name="categoryName"
        initialValue={this.state.modalCurrentValue}
        rules={[{ required: true, message: '分类名必须输入' }]}
       >
         <Input  
         placeholder="请输入分类名"

          />
      </Form.Item>
    
      
    </Form>
            </Modal>
            </div>
            
        )
    }
}
export default Category
