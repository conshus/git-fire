import React, { Component } from 'react';
import axios from 'axios';


class ProjectPage extends Component{

  constructor (){
    super();
    this.state = {
      projectPage: {},
      projectPageOwner:{}
    }
  }
  componentDidMount (){
    console.log(this.props.match.params.id)
    axios.get('https://api.github.com/repositories/'+this.props.match.params.id)
    .then(response => {this.setState({ projectPage: response.data})});
    this.render()

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
}


  render(){
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
        <br/><input placeholder='Enter a comment' />
      </section>
    )
  }
}

export default ProjectPage;
