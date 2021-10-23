import React, { Component } from 'react'
import {v4 as uuidv4} from 'uuid' 
export default class add extends Component {
    add=()=>{//箭头函数
        let {addComment} = this.props;
        let name = this.Aname.value;
        let content =this.content.value;
        console.log(name,content);
        if(!name.trim() || !content.trim()){
            alert("输入的用户名或内容不能为空")
            return
        }
        addComment({id:uuidv4(),name,content})
    }
    render() {
        return (
            <div className="col-md-4">
            <form className="form-horizontal">
              <div className="form-group">
                <label>用户名</label>
                <input type="text" className="form-control" placeholder="用户名" ref={(Aname)=>{this.Aname = Aname}}/>
              </div>
              <div className="form-group">
                <label>评论内容</label>
                <textarea className="form-control" rows="6" placeholder="评论内容" ref={(content)=>{this.content = content}}></textarea>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button onClick={this.add} type="button" className="btn btn-default pull-right">提交</button>
                </div>
              </div>
            </form>
          </div>
        )
    }
}