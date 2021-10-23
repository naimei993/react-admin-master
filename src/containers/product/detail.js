import React, { Component } from 'react'
import { Button,Card,List, message } from 'antd'
import { connect } from 'react-redux'
import  { ArrowLeftOutlined} from '@ant-design/icons'
import './detail.min.css'
import {reqProdById,reqCategoryList} from '../../api/index'
import {BASE_URL} from '../../config/index'
const {Item} = List
@connect(
    state => ({
      productList:state.productList,
      categoryList:state.categoryList
    })
  )
class Detail extends Component {
        state={
            categoryId:'',
            categoryName:'',
            desc:'',
            detail:'',
            imgs:[],
            name:'',
            price:'',
            isLoading:true
        }
        getProductById = async(id)=>{//箭头函数
            let result = await reqProdById(id)
            const {status,data,msg} = result
            if(status === 0){
                this.categoryId = data.categoryId
                this.setState({...data,isLoading:false})
            }else{
                message.error(msg)
            }
        }
        getCategorylist= async()=>{
            let result  = await reqCategoryList()
            const {status,data} = result
            if(status === 0){
               let result =  data.find((item)=>{//箭头函数
                      return item._id === this.categoryId
                })
                
                if(result) {
                   
                    this.setState({categoryName:result.name,isLoading:false})
                   
                }
                
            }
        }
    componentDidMount(){
        
        const {id} = this.props.match.params
        const reduxCateList = this.props.categoryList
       const reduxProdList = this.props.productList
       if(reduxProdList.length){
           
        let result =  reduxProdList.find((item)=>{
            return item._id === id
        })
        if(result){
            this.categoryId = result.categoryId
         this.setState({...result})
        }
       }else{
            this.getProductById(id)
       }
       if(reduxCateList.length){
        let result = reduxCateList.find((item)=>{
               return item._id === this.categoryId
           })
           this.setState({categoryName:result.name,isLoading:false})
       }else{
           this.getCategorylist()
       }
    }
    
    
    render() {
        return (
            <Card 
            title={
            <div className='left-top' >
                <Button type='link' size='small' onClick={()=>{this.props.history.goBack()}}>
                    <ArrowLeftOutlined style={{fontSize:'20px'}} />
                </Button>
                <span>商品详情</span>
                </div>}
             >
                <List loading={this.state.isLoading}>
                    <Item className='item'>
                        <span className='prod-title'>商品名称：</span>
                        <span>{this.state.name}</span>
                    </Item>
                    <Item className='item'>
                        <span className='prod-title'>商品描述：</span>
                        <span>{this.state.desc}</span>
                    </Item>
                    <Item className='item'>
                        <span className='prod-title'>商品价格：</span>
                        <span>{this.state.price}</span>
                    </Item>
                    <Item className='item'>
                        <span className='prod-title'>所属分类：</span>
                        <span>{this.state.categoryName}</span>
                    </Item>
                    <Item className='item'>
                        <span className='prod-title'>商品图片：</span>
                        {
                            this.state.imgs.map((item,index)=>{
                                return <img key={index} src={`${BASE_URL}/upload/`+item} alt="商品图片" style={{width:'200px'}}/>
                              })
                        }
                    </Item>
                    <Item className='item'>
                        <span className='prod-title'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
                    </Item>

                </List>

            </Card>
        )
    }
}

export default Detail
