import React,{Component} from 'react'
import './index.css'
import Add from './components/add/add'
import List from './components/list/list'

export default class App extends Component {
 state = {
   comments:[
     {id:'uahsdasdahsd',name:'班长',content:'芜湖'},
     {id:'uahsdasdahsa',name:'接收',content:'起飞'},
     {id:'uahsdasdahsc',name:'咪咪',content:'蚌埠'},
    ]
 }
 addComment = (commentObj)=>{
  let {comments} = this.state;
  comments.unshift(commentObj)
  this.setState({comments})
 }
 deleteComment = (id)=>{
    let comments = [...this.state.comments];
    comments = comments.filter((item)=>{
      return item.id !== id
    })
    this.setState({comments})
 }
  render() {
    let {comments} = this.state;
    return (
      <div>
    <header className="site-header jumbotron">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1>请发表对React的评论</h1>
          </div>
        </div>
      </div>
    </header>
    <div className="container">
      <Add addComment = {this.addComment}/>
      <List comments={comments} deleteComment={this.deleteComment}/>      
    </div>
  </div>
    )
  }
}

