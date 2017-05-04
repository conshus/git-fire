import React, { Component } from 'react';
import axios from 'axios';
import base from './rebase';
import logo from './logo.svg';
import './App.css';

window.base = base; //Use base from console
class App extends Component {

  constructor (){
    super();
    this.state = {
      user: {},
      projects: [],
      users: [],
      userSearch: [],
      projectSearch: []
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
      return <button
        onClick={this.logout.bind(this)}>Logout</button>
    } else {
      return <button onClick={this.login.bind(this)}>Login</button>
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
  console.log(this.state.userSearch)
  if (this.state.userSearch.length !== 0){
    return(
      <div>
        <h1>User Search Results</h1>
        {console.log(this.state.userSearch)}
        {this.state.userSearch.map((user, index) => {
          return(
             <div key={index}>
               <a key={'link'+index} href={user.html_url} target="_blank"><img key={'user'+index} src={user.avatar_url} className="userSearchImage"/>{user.login}</a>
               <button key={'button'+index} onClick={this.addSearchUserToFirebase.bind(this,user.login)}>Add to Favorites</button>
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
  { data: { name: project } })
}
displayProjectSearch(){
  console.log(this.state.projectSearch)
  if (this.state.projectSearch.length !== 0){
    return(
      <div>
        <h1>Repos Search Results</h1>
        {console.log(this.state.projectSearch)}
        <ul>
        {this.state.projectSearch.map((project, index) => {
          return(
             <li key={index}>
               <a key={'link'+index} href={project.html_url} target="_blank">{project.name}</a>
               <button key={'button'+index} onClick={this.addSearchProjectToFirebase.bind(this,project.name)}>Add to Favorites</button>
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
  const user = this.projectName.value
  axios.get('https://api.github.com/search/repositories?q='+user)
   //.then(response => console.log(response.data.items));
  .then(response => {this.setState({ projectSearch: response.data.items})});
}


formIfLoggedIn () {
  if (this.state.user.uid) {
    return (
      <div>
      <form onSubmit={this.addProjectToFirebase.bind(this)}>
        <input placeholder='Favorite GitHub Projects'
        ref={element => this.projectName = element} />
        <button>Add to Firebase</button>
      </form>
      <form onSubmit={this.addUserToFirebase.bind(this)}>
        <input placeholder='Favorite GitHub Users'
        ref={element => this.userName = element} />
        <button>Add to Firebase</button>
      </form>
      <form onSubmit={this.userSearch.bind(this)}>
        <input placeholder='Enter GitHub Username'
        ref={element => this.userName = element} />
        <button>Search Users</button>
      </form>
      <form onSubmit={this.projectSearch.bind(this)}>
        <input placeholder='Enter GitHub Repo'
        ref={element => this.projectName = element} />
        <button>Search Repos</button>
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
        <h1>projects</h1>
        {console.log(this.state.projects)}
        {this.state.projects.map((project,index) => {
          return(
            <div key={project.key+index}>
              <div key={project.key}>{project.name}</div>
              <button key={index} onClick={this.removeRecord.bind(this,'projects',project.key)}>Remove</button>
            </div>
          )}
        )}
      </div>
    )
  }
}

usersIfLoggedIn() {
  if (this.state.user.uid) {
    return(
      <div>
        <h1>users</h1>
        {console.log(this.state.users)}
        {this.state.users.map((user,index) => {
          return(
            <div key={user.key+index}>
              <div key={user.key}>{user.name}</div>
              <button key={index} onClick={this.removeRecord.bind(this,'users',user.key)}>Remove</button>
            </div>
          )}
        )}
      </div>
    )
  }
}


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {this.loginOrLogoutButton()}
        </p>
        {this.formIfLoggedIn()}
        {this.projectsIfLoggedIn()}
        {this.usersIfLoggedIn()}
        {this.displayUserSearch()}
        {this.displayProjectSearch()}
      </div>
    );
  }
}

export default App;
