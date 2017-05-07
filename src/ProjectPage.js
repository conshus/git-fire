import React, { Component } from 'react';
import axios from 'axios';


class ProjectPage extends Component{

  getProjectInfo(projectId){
    axios.get('https://api.github.com/repositories/'+projectId)
     .then(object => {
       //console.log(object.data)
         const project = object.data;
        return(
          <div>
            this should show up
            {console.log(project)}
          <h6>{project.owner.login}</h6>
        </div>
        )
     });
  }


  render(){
    const projectId = this.props.match.params.id;
    return(
      <section>
        {console.log(projectId)}
        Here is the Project Page
        {this.getProjectInfo(projectId)}
      </section>
    )
  }
}

export default ProjectPage;
