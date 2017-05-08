import React, { Component } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import base from './rebase';
window.base = base; //Use base from console


class ProjectPage extends Component{

  constructor (){
    super();
    this.state = {
      projectPage: {},
      projectPageOwner:{},
      comments: []
    }
  }
  componentDidMount (){
    console.log(this.props.match.params.id)
    axios.get('https://api.github.com/repositories/'+this.props.match.params.id)
    .then(response => {this.setState({ projectPage: response.data})});

    base.syncState(`/project/${this.props.match.params.id}/comments`,{
      context: this,
      state: 'comments',
      asArray: true
    })


  }

componentWillReceiveProps(nextProps){
  console.log('componentWillReceiveProps',nextProps)
  axios.get('https://api.github.com/repositories/'+nextProps.match.params.id)
  .then(response => {
    this.setState({
      projectPage: response.data,
      projectPageOwner: response.data.owner
    })
  });

  base.syncState(`/project/${nextProps.match.params.id}/comments`,{
    context: this,
    state: 'comments',
    asArray: true
  })

  // base.fetch(`/project/${nextProps.match.params.id}/comments`, {
  //    context: this,
  //    asArray: true
  //  }).then(data => {this.setState({ comments: data})})
  //  .catch(error => {
  //    //handle error
  //  })

}

enterComment(event){
  event.preventDefault();
  const comment = this.projectComment.value;
  console.log(comment);
  base.push(`/project/${this.props.match.params.id}/comments`,
  { data: { id: this.props.user.uid, user: this.props.user.displayName, comment: comment } })
  this.projectComment.value="";
}

  displayProjectComments(){
    console.log(this.state.projectPage.id)
     console.log(this.state.comments)
    if (this.state.comments.length !== 0){
      return(
        <div>
          <h6>Comments</h6>
          {console.log(this.state.comments)}
          {this.state.comments.map((comment, index) => {
            return(
               <div key={index}>
                 <Link to={`/user/${this.props.user.uid}`}>
                 {comment.user}
               </Link>
               : {comment.comment}
               </div>

            )}
          )}
        </div>
      )
    }

  }

  render(){
    console.log(this.props.user);
    const projectId = this.props.match.params.id;
    //this.getProjectInfo(projectId);
    console.log(this.state.projectPage);
    console.log(this.state.projectPageOwner);
    return(
      <section>
        <br/>Project: {this.state.projectPage.name}
        <br/> projectId: {projectId}
        <br/><a href={this.state.projectPage.html_url} target="_blank">Project link on GitHub</a>
        <br/> <img src={this.state.projectPageOwner.avatar_url} className="circle userSearchImage"/>by {this.state.projectPageOwner.login}
        <br/>{this.state.projectPage.stargazers_count} <i className="material-icons">grade</i>
        <br/><a href={this.state.projectPageOwner.html_url} target="_blank">Owner GitHub page</a>
        <br/>created: {this.state.projectPage.created_at}
        <br/>updated: {this.state.projectPage.updated_at}
        <br/>homepage: <a href={this.state.projectPage.homepage} target="_blank">{this.state.projectPage.homepage}</a>
        <br/>language(s): {this.state.projectPage.language}
        <br/>open issue count: {this.state.projectPage.open_issues_count}
        <form onSubmit={this.enterComment.bind(this)}>
          <input placeholder='Enter a comment'
          ref={element => this.projectComment = element} />
          <button className="waves-effect waves-light btn">Enter a comment</button>
        </form>
        {this.displayProjectComments()}
        {/* <br/><input id="projectComment" placeholder='Enter a comment' />
        <button className="waves-effect waves-light btn"
          onClick={this.enterComment.bind(this)}>Enter Comment</button> */}
      </section>
    )
  }
}

export default ProjectPage;
