import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Card,Button,Select,Input,Table, message,Modal } from 'antd';
import {PlusCircleOutlined,SearchOutlined} from '@ant-design/icons'
import {reqProductList,reqUpdateProdStatus,reqSearchProductList,reqDeleteProduct} from '../../api/index'
import { PAGE_SIZE } from '../../config';
import {createSaveProductAction} from '../../redux/action_creators/product_action'
const { Option } = Select;
class Product extends Component {
    state={
        productList:[],//商品列表数据
        total:'',//总的页数
        current:1,//当前在哪
        keyWord:'',//搜索关键字
        searchType:'productName',//搜索类型
        isLoading:true,
        isModalVisible:false,
        _id:'',
        productName:''
    }
    componentDidMount(){
        this.getProductList()
    }

    getProductList = async(number=1)=>{
        let result
    if(this.isSearch){
        const {searchType,keyWord} = this.state
        result = await reqSearchProductList(number,PAGE_SIZE,searchType,keyWord);
    }else{
        result = await reqProductList(number,PAGE_SIZE)
    }
        const {status,data} = result;
        if(status===0){
            this.setState({
                productList:data.list,
                total:data.total,
                current:number,
                isLoading:false
                
            })
            //将商品列表存入redux
            this.props.saveProduct(data.list)
        }else{
            message.error('初始化商品列表失败')
        }
    }
    updateProdStatus = async({_id,status})=>{//箭头函数
        let productList = [...this.state.productList]
        if(status === 1) status = 2
        else status = 1
        let result = await reqUpdateProdStatus(_id,status)
        if(result.status === 0){
            message.success('更新商品状态成功')
            productList.map((item)=>{//箭头函数
                  if(item._id === _id){
                      item.status = status
                  }
                    return item
            })
            this.setState({productList})
        }else{
            message.error('更新商品状态失败')
        }
    }
    inputChange = (event)=>{
        if(event.target.value === ''){
            this.isSearch = false
           this.getProductList()
        }else{
            this.setState({keyWord:event.target.value})
        }
        
    }
    search = async()=>{//箭头函数
          this.isSearch = true
          this.getProductList()
    }
    deleteProduct = async(_id) =>{
        let result = await reqDeleteProduct(_id)
        const {status} = result
        if(status === 0){
            message.success('删除成功',1)
            this.getProductList()
        }else{
            message.error('删除失败',1)
        }
    }
    showModal = (item) => {
        this.setState({isModalVisible:true,_id:item._id,productName:item.name})

      };
    
     handleOk = () => {
        this.setState({isModalVisible:false})
        this.deleteProduct(this.state._id)
      };
    
      handleCancel = () => {
        this.setState({isModalVisible:false})
      };
    
    render() {
        const dataSource =this.state.productList
          const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
              key: 'name',
              width:'18%'
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
              key: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              key: 'price',
              align:'center',
              width:'9%',
              render:(price)=>'￥'+price
            },
            {
                title: '状态',
                // dataIndex: 'status',
                key: 'status',
                align:'center',
                width:'10%',
                render:(item)=>{
                    return (
                        <div>
                            <Button 
                            type={item.status === 1 ? 'danger':'primary'}
                            onClick={()=>{this.updateProdStatus(item)}}
                            >
                                    
                                {item.status === 1 ? '下架':'上架'}
                            </Button><br/>
                            <span>{item.status ===1 ? '在售' : '已停售'}</span>
                        </div>
                    )
                }
              },
              {
                title: '操作',
                // dataIndex: 'opera',
                key: 'opera',
                align:'center',
                width:'10%',
                render:(item)=>{
                    return(
                        <div>
                            <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button>
                            <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
                            <Button type='link' onClick={()=>{this.showModal(item)}}>删除</Button>
                            <Modal destroyOnClose okText="确定" cancelText="取消" title={`删除${this.state.productName}`} visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                            <p style={{fontSize:'20px',fontWeight:'500'}}>确定删除<span style={{color:'red'}}>{this.state.productName}?</span></p>
                            
                             </Modal>
                        </div>
                    )
                }
              },
          ];
          
        return (
            <Card 
            title={
                <div>
                <Select defaultValue="productName"onChange={(value)=>{this.setState({searchType:value})}}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input style={{width:'20%',margin:'0px 10px'}} 
                placeholder="请输入搜索关键字" 
                allowClear
                onChange={this.inputChange}
                />
                <Button type="primary" onClick={this.search}> <SearchOutlined />搜索</Button>
                </div>
            }
            extra={<Button type='primary' onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}> <PlusCircleOutlined />添加商品</Button>} 
           >
               <Table 
               dataSource={dataSource} 
               columns={columns}
               bordered
               rowKey='_id'
               loading={this.state.isLoading}
               pagination={{
                   pageSize:PAGE_SIZE,
                   current:this.state.current,
                   total:this.state.total,
                   onChange:this.getProductList
               }}
               />
            </Card>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
       
    }
  }
export default connect(
    mapStateToProps,{saveProduct:createSaveProductAction,}
  )(Product)
