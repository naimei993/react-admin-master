import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../config/index'
import {reqDeletePicture} from '../../api/index'
//将图片变成base64编码形式
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
      
    ],
  };
  //关闭预览窗
  handleCancel = () => this.setState({ previewVisible: false });
  //展示预览窗
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async({ file,fileList }) => {
      if(file.status === 'done'){
        console.log(file.response.data.url);
        fileList[fileList.length-1].url = file.response.data.url
        fileList[fileList.length-1].name = file.response.data.name
        
    }
    if(file.status === 'removed'){
      let result = await reqDeletePicture(file.name)
      const {status,msg} = result
      if(status === 0){
        message.success("删除图片成功")
      }else{
        message.error(msg)
      }
       console.log("删除",file.name);
        
    }
    this.setState({ fileList });
  }
  getImageArr = ()=>{//箭头函数
        let result = []
        this.state.fileList.forEach((item)=>{
          result.push(item.name)
        })
        return result
  }
  setFileList =(imgArr)=>{//箭头函数
        let result = []
        imgArr.forEach((item,index)=>{
          result.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
        })
        this.setState({fileList:result})
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/manage/img/upload`}//接收图片服务器的地址
          method="post"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
