import React, { Component } from 'react';
import axios from 'axios';


class ProjectPage extends Component{

  constructor (){
    super();
    this.state = {
      projectPage: {},
    }
  }
  // componentDidMount (){
  //   console.log(this.props.match.params.id)
  //   axios.get('https://api.github.com/repositories/'+this.props.match.params.id)
  //   .then(response => {this.setState({ projectPage: response.data})});
  //   this.render()
  //
  // }

//   shouldComponentUpdate (nextProps, nextState){
//     console.log('shouldComponentUpdate',nextProps.match, nextState)
//     if (nextProps.match.params.id != nextState.projectPage.id){
//       axios.get('https://api.github.com/repositories/'+nextProps.match.params.id)
//       .then(response => {this.setState({ projectPage: response.data})});
//       console.log("don't match, should update")
//       this.render()
//       return true;
//     } else {
//       console.log("match, no need to update");
//
//       return false;
//     }
//     // return a boolean value
// }
//
// componentWillUpdate (nextProps, nextState){
//     console.log('componentWillUpdate')
//     axios.get('https://api.github.com/repositories/'+nextProps.match.params.id)
//     .then(response => {this.setState({ projectPage: response.data})});
// }

componentWillReceiveProps(nextProps){
  console.log('componentWillReceiveProps',nextProps)
  axios.get('https://api.github.com/repositories/'+nextProps.match.params.id)
  .then(response => {this.setState({ projectPage: response.data})});
}
//   componentDidUpdate() {
//           console.log('component did update')
//           console.log(this.props.match.params.id)
//           axios.get('https://api.github.com/repositories/'+this.props.match.params.id)
//           .then(response => {this.setState({ projectPage: response.data})});
//       }
  printProjectInfo(project)
  {
    return (
     <div>this should work</div>
   )
  }

  getProjectInfo(projectId){
    axios.get('https://api.github.com/repositories/'+projectId)
    .then(response => {this.setState({ projectPage: response.data})});

    //.then(object => this.printProjectInfo(object))
    //  .then(object => {
    //    //console.log(object.data)
    //      const project = object.data;
    //     return(
    //       // <div>
    //         //this should show up
    //         //{console.log(project.owner.login)}
    //       <h6>{project.owner.login}</h6>
    //     // </div>
    //     )
    //  });
  }
 // test(){
 //   console.log(this.props.match.params.id)
 //   //this.getProjectInfo(this.props.match.params.id)
 //   return(
 //     <div>this should show up!</div>
 //   )
 // }
displayProjectInfo(){
  console.log('displayProjectInfo')
  console.log(this.state.projectPage)
  this.getProjectInfo(this.state.projectPage.id)
  // if (this.props.state.projectPage){
  //   return(
  //     <div>
  //       <h6>Project Info</h6>
  //       {console.log(this.state.projectPage)}
  //
  //         )}
  //       )}
  //     </div>
  //   )
  // }

}


  render(){
    const projectId = this.props.match.params.id;
    //this.getProjectInfo(projectId);
    return(
      <section>
        {console.log(projectId)}
        {console.log(this.state.projectPage)}
        Here is the Project Page
        <br/>projectPage.id:{this.state.projectPage.id}
        <br/>projectPage.id:{this.state.projectPage.name}
        <br/> projectId: {projectId}
        {/* {this.getProjectInfo(projectId)} */}
        {/* {this.test()} */}
        {/* {this.displayProjectInfo()} */}
      </section>
    )
  }
}

export default ProjectPage;
