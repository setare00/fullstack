import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'; 
import logo from '../src/logo.png';
const Joi = require('@hapi/joi');


export default class Home extends Component {
  state ={
  email:'',
  message: null,
  url:null,
  hide:false
  }

  componentDidMount(){

  }

  handleSubmit = async(e) =>{
    e.preventDefault();
    this.setState({message:null});
    let email = this.state.email;
    const schema =Joi.object({email: Joi.string().email({ tlds: { allow: false } })});
    const {error } = schema.validate({email:email});
    if(error){
      this.setState({message:'Invalid Email.'});
      return;
    }

     localStorage.setItem('email', email);
    // let email = this.email.current.value;
    let domain = email.split('@')[1].replace('.','dot');
    let res = await axios.post('/domainvalidation',{domain:domain});
    // let {data} = res.data;
    if(!res.data) {
      this.setState({message: 'Company not found.'});
      return;
    }
    else {
      await axios.post('/login', {email:email});
      if(res.data.admin_user.includes(email))
       this.setState({hide:true, url:`/admin/${domain}`});// this.setState({url:});
      else
      this.setState({hide:true, url:`/booking/${domain}/`});// this.setState({url:});
      // console.log('url:', url.data)
      // let url = await axios.post('/sendemail', {domain:domain, uid: AnonymLoginRes.data.uid});
    }
  };


  handleChange = e=>{
    // let email = this.state.email;
   let  email = e.currentTarget.value;
    this.setState({email})
  }

  render() {
    let message = this.state.message;
    return (
      <div className="container text-center" style={{alignItems:'center', marginTop:20}}>
        <img className="rounded mx-auto d-block" style={{height:80, width: 300,marginBottom:10}} src={logo} alt="logo"/>
        {!this.state.hide?
        <div>
        <h2 className="text-center" style={{padding:20}}>Please enter your work email adress and we'll send you an email to book sessions at Silofit</h2>
        <form onSubmit={this.handleSubmit} className="form-inline justify-content-center">  
          <div className="form-group form-row"  style={{padding:20}}>
          {message ? <div className=" col-md-12 alert alert-danger">{message}</div> : null}
            <div className=" col-md-6">
              <input 
              autoFocus
              value={this.state.email}
              type="email"
              className="form-control col-md-12"
              placeholder="Enter work email address"
              onChange={this.handleChange}></input>
            </div>
            <div className="form-group col-md-6">
            <button className="btn btn-secondary">Send me my access link</button>
            </div>
          </div>
        </form>
        </div>
        :<div>
          <h1 className="text-center" style={{padding:20}}>Email send to your email<br/> Please check your inbox, you can close this window.</h1>
          <Link to={this.state.url}>Click here instead :(</Link>
        </div>
        }
      </div>
    );
  }
}