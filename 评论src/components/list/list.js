import Item from '../item/item'
import React, { Component } from 'react'

export default class list extends Component {
    render() {
        let {comments,deleteComment} = this.props;
        return (
            <div className="col-md-8">
        <h3 className="reply">评论回复：</h3>
        <h2 style={{display:comments.length === 0 ? 'block' : 'none'}}>暂无评论，点击左侧添加评论！！！</h2>
        <ul className="list-group">
          {
              comments.map((item)=>{//箭头函数
                   return <Item key={item.id} {...item} deleteComment={deleteComment}/> 
              })
          }
        </ul>
      </div>
        )
    }
}
