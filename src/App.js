import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import axios from 'axios';
import base from './rebase';
import logo from './logo.svg';
import giphy from './github-giphy-downsized.gif';
import './App.css';
import ProjectPage from './ProjectPage';
import UserProjectPage from './UserProjectPage';
window.base = base; //Use base from console
class App extends Component {

  constructor (){
    super();
    this.state = {
      user: {},
      projects: [],
      users: [],
      userSearch: [],
      projectSearch: [],
      userProjectToggle: true
    }
  }

componentDidMount() {
  base.auth().onAuthStateChanged(user => {
    if (user) {
      console.log('User is signed in.', user);
      this.setState({
        user: user
      })
      base.syncState(`/users/${user.uid}/projects`,{
        context: this,
        state: 'projects',
        asArray: true
      })
      base.syncState(`/users/${user.uid}/users`,{
        context: this,
        state: 'users',
        asArray: true
      })
    } else {
      console.log('User is logged out.')
      this.setState({
        user: {}
      })
    }
  });

}

  login (){
    var authHandler = (error, data) => {
      console.log('user', data.user)
      this.setState({
        user: data.user
      })
    }
    //basic
    base.authWithOAuthPopup('github', authHandler);
  }

  logout () {
    base.unauth()
    this.setState({
      user: {}
    })
  }

  loginOrLogoutButton (){
    if (this.state.user.uid){
      return <button className="waves-effect waves-light btn"
        onClick={this.logout.bind(this)}><i className="fa fa-github" aria-hidden="true"></i> Logout</button>
    } else {
      return <button className="waves-effect waves-light btn" onClick={this.login.bind(this)}><i className="fa fa-github" aria-hidden="true"></i> Login</button>
    }
  }


  welcome () {
    if (base.auth().currentUser){
      return (<button
        onClick={this.logout.bind(this)}>Logout</button>
      )
    } else {
      return <button>Login</button>
    }
  }

addProjectToFirebase (event) {
  event.preventDefault();
  const project = this.projectName.value;
  console.log(project);
  base.push(`/users/${this.state.user.uid}/projects`,
  { data: { name: project } })
}

addUserToFirebase (event) {
  event.preventDefault();
  const user = this.userName.value;
  console.log(user);
  base.push(`/users/${this.state.user.uid}/users`,
  { data: { name: user } })
}

addSearchUserToFirebase (user) {
  event.preventDefault();
  console.log(user);
  base.push(`/users/${this.state.user.uid}/users`,
  { data: { name: user } })
}

displayUserSearch(){
  // console.log(this.state.userSearch)
  if (this.state.userSearch.length !== 0){
    return(
      <div>
        <h6>User Search Results</h6>
        {console.log(this.state.userSearch)}
        {this.state.userSearch.map((user, index) => {
          return(
             <div key={index}>
               <a key={'link'+index} href={user.html_url} target="_blank"><img key={'user'+index} src={user.avatar_url} className="circle userSearchImage"/>{user.login}</a>
               <button key={'button'+index} className="waves-effect waves-light btn" onClick={this.addSearchUserToFirebase.bind(this,user.login)}>Add to Favorites</button>
             </div>

          )}
        )}
      </div>
    )
  }
}


userSearch (event){
  event.preventDefault();
  const user = this.userName.value
  axios.get('https://api.github.com/search/users?q='+user)
   //.then(response => console.log(response.data.items));
  .then(response => {this.setState({ userSearch: response.data.items})});
}

addSearchProjectToFirebase (project) {
  event.preventDefault();
  console.log(project);
  base.push(`/users/${this.state.user.uid}/projects`,
  { data: { name: project.name, id: project.id} })
}

removeSearchProjectFromFirebase (projectToBeRemoved){
  event.preventDefault();
  console.log(projectToBeRemoved);
  console.log(this.state.projects)
  let projectRemovedFromFavorites = this.state.projects.find(function(project){
    return project.id === projectToBeRemoved.id
  })

  console.log(projectRemovedFromFavorites)
  base.remove(`/users/${this.state.user.uid}/projects/${projectRemovedFromFavorites.key}`, function(err){
    if(!err){
      console.log('Record deleted');
    } else {
      console.log(err);
    }
  });


  // let filteredProjects = this.state.projects.filter(function(project){
  //   return project.id === projectRemoved.id
  // })
  // this.setState({
  //   projects: filteredProjects
  // })

}

addOrRemoveButton (project){
  const projectIds = this.state.projects.map(project => project.id);
  //console.log(projectIds);
  //console.log(project);
  const alreadyInFirebase = projectIds.includes(project.id)

  if (alreadyInFirebase){
    //let projectRemoved =
    return <button className="waves-effect waves-light btn" onClick={this.removeSearchProjectFromFirebase.bind(this,project)}>Remove from Favorites</button>
  } else {
    return <button className="waves-effect waves-light btn" onClick={this.addSearchProjectToFirebase.bind(this,project)}>Add to Favorites</button>
  }
}
displayProjectSearch(){
  console.log(this.state.projectSearch)
  if (this.state.projectSearch.length !== 0){
    return(
      <div>
        <h6>Repos Search Results</h6>
        {console.log(this.state.projectSearch)}
        <h6>{this.state.projectSearch.total_count} Results</h6>
        <ul>
        {this.state.projectSearch.items.map((project, index) => {
          return(
             <li key={index}>
               <a key={'link'+index} href={project.html_url} target="_blank">{project.name}</a>
               <br/> <img src={project.owner.avatar_url} className="circle userSearchImage"/>by {project.owner.login}
               <br/>{project.stargazers_count} <i className="material-icons">grade</i>
               <Link  className="waves-effect waves-light btn" to={`/project/${project.id}`}>More Info</Link>
               {this.addOrRemoveButton(project)}
               {/* <button key={'button'+index} onClick={this.addSearchProjectToFirebase.bind(this,project)}>Add to Favorites</button> */}
             </li>

          )}
        )}
      </ul>
      </div>
    )
  }
}

projectSearch (event){
  event.preventDefault();
  const project = this.projectName.value
  axios.get('https://api.github.com/search/repositories?q='+project)
   //.then(response => console.log(response.data.items));
  .then(response => {this.setState({ projectSearch: response.data})});
}


formIfLoggedIn () {
  if (this.state.user.uid) {
    return (
      <div>
      <form onSubmit={this.addProjectToFirebase.bind(this)}>
        <input placeholder='Favorite GitHub Projects'
        ref={element => this.projectName = element} />
        <button className="waves-effect waves-light btn">Add to Firebase</button>
      </form>
      <form onSubmit={this.addUserToFirebase.bind(this)}>
        <input placeholder='Favorite GitHub Users'
        ref={element => this.userName = element} />
        <button className="waves-effect waves-light btn">Add to Firebase</button>
      </form>
      <form onSubmit={this.userSearch.bind(this)}>
        <input placeholder='Enter GitHub Username'
        ref={element => this.userName = element} />
        <button className="waves-effect waves-light btn">Search Users</button>
      </form>
      <form onSubmit={this.projectSearch.bind(this)}>
        <input placeholder='Enter GitHub Repo'
        ref={element => this.projectName = element} />
        <button className="waves-effect waves-light btn">Search Repos</button>
      </form>
    </div>
    )
  }
}

removeRecord(recordType,key){
  console.log(recordType, key);
  base.remove(`/users/${this.state.user.uid}/${recordType}/${key}`, function(err){
    if(!err){
      console.log('Record deleted');
    } else {
      console.log(err);
    }
  });
}

projectsIfLoggedIn() {
  if (this.state.user.uid) {
    return(
      <div>
        <h6>projects</h6>
        {this.state.projects.map((project,index) => {
          return(
            <div key={project.key+index}>
              <div key={project.key}>{project.name}</div>
              <Link  className="waves-effect waves-light btn" to={`/project/${project.id}`}>more info</Link>
              <button className="waves-effect waves-light btn" key={index} onClick={this.removeRecord.bind(this,'projects',project.key)}>Remove</button>
            </div>
          )}
        )}
        <form onSubmit={this.projectSearch.bind(this)}>
          <input placeholder='Enter GitHub Repo'
          ref={element => this.projectName = element} />
          <button className="waves-effect waves-light btn">Search Repos</button>
        </form>
        {this.displayProjectSearch()}

        {console.log(this.state.projects)}
      </div>
    )
  }
}

usersIfLoggedIn() {
  if (this.state.user.uid) {
    return(
      <div>
        <h6>users</h6>
        {this.state.users.map((user,index) => {
          return(
            <div key={user.key+index}>
              <div key={user.key}>{user.name}</div>
              <button className="waves-effect waves-light btn" key={index} onClick={this.removeRecord.bind(this,'users',user.key)}>Remove</button>
            </div>
          )}
        )}
        <form onSubmit={this.userSearch.bind(this)}>
          <input placeholder='Enter GitHub Username'
          ref={element => this.userName = element} />
          <button className="waves-effect waves-light btn">Search Users</button>
        </form>
        {this.displayUserSearch()}

        {/* {console.log(this.state.users)} */}
      </div>
    )
  }
}

toggleUserProject(tabPressed){
  if (tabPressed==="users"){
    this.setState({
      userProjectToggle: true
    })
  } else {
    this.setState({
      userProjectToggle: false
    })

  }
}

favoritesSection(){
  if (this.state.user.uid){
    return(
      <div>
        <div className="card-tabs">
          <ul className="tabs tabs-fixed-width">
            <li className="tab" onClick={this.toggleUserProject.bind(this,"users")}><a className="active">Users</a></li>
            <li className="tab" onClick={this.toggleUserProject.bind(this,"projects")}><a>Repos</a></li>
          </ul>
        </div>
        {this.state.userProjectToggle && this.usersIfLoggedIn()}
        {!this.state.userProjectToggle && this.projectsIfLoggedIn()}

      </div>
    )
  }
}
displayLoginSplash(){
  if (!this.state.user.uid){
    return(
      <div className="wholeScreen flex hcenter vcenter">
        <div className="card loginSplash">
          <div className="card-image">
            <img src={giphy} className="responsive-img" alt="github giphy" />
            <span className="card-title"></span>
          </div>
          <div className="card-content">
            {this.loginOrLogoutButton()}
          </div>
        </div>
      </div>

    )
  }
}

userDashboard(){
  if (this.state.user.uid){
    return(
      <div className="userDashboard">

        <div className="row">
          <div className="col s12 m4">{this.loginOrLogoutButton()}</div>
          <div className="col s12 m4">
            favorites
            {this.favoritesSection()}
          </div>
          <div className="col s12 m4">
            {/* <Router> */}
            <Route path='/project/:id?' render={(defaultProps) => {
              return <ProjectPage user={this.state.user} {...defaultProps} />
                }
              }
            />
            <Route path='/user/:id?' render={(defaultProps) => {
              return <UserProjectPage user={this.state.user} {...defaultProps} />
                }
              }
            />
            {/* </Router> */}
          </div>
        </div>

      </div>
    )
  }
}
  render() {
    return (
      <div className="App">

        {this.displayLoginSplash()}
        {/* <Router forceRefresh={true}> */}
        <Router>
          {this.userDashboard()}
        </Router>


{/*
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
        </p>
        {this.formIfLoggedIn()}
        {this.projectsIfLoggedIn()}
        {this.usersIfLoggedIn()}
        {this.displayUserSearch()}
        {this.displayProjectSearch()} */}
      </div>
    );
  }
}

export default App;
