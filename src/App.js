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
      userSearch: {}
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

displayUserSearch(){
  console.log(this.state.userSearch)
  if (this.state.user.uid){
    return (
      <div>
        <img src={this.state.userSearch.avatar_url}/>
        <button onClick={this.addUserToFirebase.bind(this)}>Add To Favorites</button>
      </div>
    )
  }
}
userSearch (event){
  event.preventDefault();
  const user = this.userName.value
  axios.get('https://api.github.com/users/'+user)
  .then(response => {this.setState({ userSearch: response.data})});
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
      </div>
    );
  }
}

export default App;
