import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
//const qs = require('querystring')

export default class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleAccess = this.handleAccess.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      username: 'Jim',
      accessToken : '',
      refreshToken : '',
      message : '',
      pages : cookie.load('pages')
    }
  }



  async handleLogin(){
    //use return value to force handleLogout and axios.post will be async
    if(this.state.accessToken!=''){
      await this.handleLogout();
    }
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const request=await axios.post('http://localhost:4000/login',{ "username": this.state.username },config
          ).then(res => {
              console.log(res);
              this.setState(res.data);
              this.setState({message: 'Log in'});
          }).catch(error => {
            console.log(error);
            this.setState({message: 'Log in Fail'});
          })
  }

  componentDidMount() {
    //log out when close window
    window.addEventListener('beforeunload', async (e)=> { 
      e.preventDefault(); 
      await this.handleLogout();
			e.returnValue = ''; 
    });
    if(this.state.pages==NaN)
      cookie.save('pages',0,{path:"/"});
    else
      cookie.save('pages',this.state.pages+1,{path:"/"});
    this.handleLogin();
  }
  componentWillUnmount(){

    this.handleLogout();
  }
  handleAccess() {
    let config = {
      headers: {
        'Authorization': 'Bearer ' + this.state.accessToken
      }
    }
    axios.get(
              'http://localhost:5000/posts',config
            )
            .then(res => {
              console.log(res);
              this.setState({message:res.data[0].username+' '+res.data[0].title})
            })
            .catch( error=> {
              console.log(error);
              this.setState({message: 'invalid accessToken'});
            })
  }
  handleRefresh() {
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios.post(
              'http://localhost:4000/token',{token:this.state.refreshToken},config
            )
            .then(res => {
              console.log(res);
              this.setState(res.data);
              this.setState({message: 'update accessToken'});
            })
            .catch(error=>{
              console.log(error);
              this.setState({message: 'invalid refreshToken'});
            })
  }
  handleLogout(){
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    //delete: json data must put in {data: your_data }
    let data = {token:this.state.refreshToken}
    const request = axios.delete(
              'http://localhost:4000/logout',{data},config
            )
            .then(res => {
              console.log(res);
              this.setState(res.data);
              this.setState({message: 'Log out'});
              this.setState({accessToken: ''});
              this.setState({refreshToken: ''});
            })
            .catch(error=>{
              console.log(error);
              this.setState({message: 'Log out Fail'});
            })
    return request;
  }
  handleChange(e){
    this.setState({username: e.target.vale});
  }



  render() {

	return (
	<div>
    <input type="text" onChange={this.handleChange} value={this.state.username}></input><br></br>
    <p>{'accessToken: '+this.state.accessToken}</p>
    <p>{'refreshToken: '+this.state.refreshToken}</p>
    <p>{'message: '+this.state.message}</p>
    <button onClick={this.handleLogin}>log in</button>
	  <button onClick={this.handleAccess}>access</button>
    <button onClick={this.handleRefresh}>refresh</button>
    <button onClick={this.handleLogout}>log out</button>
	</div>
	)}
}