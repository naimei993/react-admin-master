import { Button,Card,Form,Select,Input, message} from 'antd'
import React, { Component } from 'react'
import  { ArrowLeftOutlined} from '@ant-design/icons'
import { connect } from 'react-redux'
import {reqCategoryList,reqAddProduct,reqProdById,reqUpdateProduct} from '../../api/index'
import PicturesWall from './picture_wall'
import EditorConvertToHTML from './rich_text_editor'
const {Option} = Select
@connect(
    state =>({
        categoryList:state.categoryList,
        productList:state.productList
    }),
    {}
)
class Add_update extends Component {
  constructor(props){
    super(props)
    this.pictureWall = React.createRef()
    this.richTextEditor = React.createRef()
  }
  formRef = React.createRef();
    state={
        categoryList:[],
        operaType:'add',
        categoryId:'',
        desc:'',
        detail:'',
        imgs:[],
        name:'',
        price:'',
        _id:'',
        isLoading:true
    }
    componentDidMount(){
        const {categoryList,productList} = this.props
        const {id} = this.props.match.params
        if(categoryList.length){
            this.setState({categoryList})
        }else{
            this.getCategoryList()
        }
        if(id){
          this.setState({operaType:'update'})
          if(productList.length){
           let result = productList.find((item)=>{
              return item._id === id
            })
            if(result) {
              this.setState({...result})
              this.pictureWall.current.setFileList(result.imgs)
              this.richTextEditor.current.setRichText(result.detail)
            }
            setTimeout(this.setDetialMessage,0);
          }else{
           setTimeout(this.setDetialMessage,1000);
            this.getProductList(id)
          }

        }
    }
 
    getProductList = async(id)=>{//箭头函数
          let result = await reqProdById(id)
          const {status,data} = result
          if(status === 0){
            this.setState({...data})
            this.pictureWall.current.setFileList(data.imgs)
              this.richTextEditor.current.setRichText(data.detail)
          }
    }
    getCategoryList = async()=>{//箭头函数
          let result = await reqCategoryList()
          const {status,data} = result
          if(status===0){
              this.setState({categoryList:data})
          }else{
              message.error('请求错误')
          }
    }
    setDetialMessage = ()=>{//箭头函数
      this.formRef.current.setFieldsValue({
        name:this.state.name || '',
        desc:this.state.desc || '',
        price:this.state.price || '',
        categoryId:this.state.categoryId || '',
      })
    }
     onFinish = async(values) => {
       const {operaType,_id} = this.state
      let imgs = this.pictureWall.current.getImageArr()
      let detail = this.richTextEditor.current.getRichText();
      let result;
      if(operaType === 'add'){
        result = await reqAddProduct({...values,imgs,detail})
      }else{
        result = await reqUpdateProduct({...values,imgs,detail,_id})
      }
      const {status} = result
      if(status === 0){
        message.success('操作成功')
        this.props.history.replace('/admin/prod_about/product')
      }else{
        message.error('操作失败')
      }
      };
      onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error(errorInfo,3)
      };
    render() {
      const {operaType} = this.state
        return (
            <Card 
            title={
            <div className='left-top' >
                <Button type='link' size='small' onClick={()=>{this.props.history.goBack()}}>
                    <ArrowLeftOutlined style={{fontSize:'20px'}} />
                </Button>
                <span>{operaType === 'update' ? '商品修改' : '商品添加'}</span>
                </div>}
             >
                <Form 
                ref={this.formRef}
                 name="aaaa"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              labelCol={{md: 2,}}
              wrapperCol={{md: 7,}}
          >
            <Form.Item 
            label="商品名称"
            name='name'
            rules={[{required:true,message:'商品名称不能为空'}]}
            >
              <Input
              placeholder='商品名称'
              />
            </Form.Item>

            <Form.Item 
            label="商品描述"
            name='desc'
            rules={[{required:true,message:'商品描述不能为空'}]}
            >
               <Input
              placeholder='商品描述'
              />
            </Form.Item>

            <Form.Item 
            label="商品价格"
            name='price'
            rules={[{required:true,message:'商品价格不能为空'}]}
            >
             <Input placeholder="商品价格"
                  addonAfter="元"
                  prefix="￥"
                  type="number"/>
            </Form.Item>

            <Form.Item 
            label="商品分类"
            name='categoryId'
            rules={[{required:true,message:'商品分类不能为空'}]}
            >
              <Select>
                  <Option value="">请选择分类</Option>
                  {
                    this.state.categoryList.map((item)=>{
                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
                  }
                </Select>
            </Form.Item>

            <Form.Item  label="商品图片" wrapperCol={{md:12}}>
              <PicturesWall ref={this.pictureWall}/>
            </Form.Item>

            <Form.Item label="商品详情" wrapperCol={{md:16}}>
             <EditorConvertToHTML ref = {this.richTextEditor}/>
            </Form.Item>
            
            <Button type="primary" htmlType="submit">提交</Button>
          </Form>

            </Card>
            
        )
    }
}
export default Add_update