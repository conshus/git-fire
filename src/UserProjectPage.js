import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import base from './rebase';
window.base = base; //Use base from console

class UserProjectPage extends Component {

  constructor (){
    super();
    this.state = {
      projects: []
    }
  }


  componentDidMount (){
    console.log(this.props.match.params.id)

    base.syncState(`/users/${this.props.match.params.id}/projects`,{
      context: this,
      state: 'projects',
      asArray: true
    })
  }

displayUserProjects(){
  console.log(this.state.projects)
  return(
    <div>
    {this.state.projects.map((project, index) => {
      return(
         <div key={index}>
           <Link to={`/project/${project.id}`}>
             {project.name}
           </Link>
         </div>

      )}
    )}
</div>
  )
}

render(){
  console.log(this.props.user)
  return (
    <section>
      <h3>{this.props.user.displayName}</h3>
      <h6>favorited projects</h6>
      {this.displayUserProjects()}
    </section>
  )
}


}

export default UserProjectPage;
