import React, { Component } from 'react'
import axios from 'axios'; 
import logo from '../src/logo.png';
const Joi = require('@hapi/joi');


export default class admin extends Component {
  constructor(props){
    super(props)
    this.getRecords = this.getRecords.bind(this);
    this.state ={
      records:[],
      emailErr:null
    }
  }

  async componentDidMount(){
      this.getRecords();
    }
  
  async getRecords(){
  let recs = await axios.post('/getspots', {domain:this.props.match.params.domain});
  this.setState({records:recs.data});
  }

  handleChange = e=>{
    let email = e.currentTarget.value;
    this.setState({email, validate:null});
  }

  bookASpace = async(docId)=>{   
    let inputEmail = this.state.email; 
    let adminEmail = localStorage.getItem('email'); 
    let domain = adminEmail.split('@')[1];
    const schema =Joi.object({email: Joi.string().email({ tlds: { allow: false } })});
    const {error } = schema.validate({email:inputEmail});
    if(error || inputEmail.split('@')[1] !== domain){
      this.setState({validationMsg:'Invalid Email.'});
      return;
    }
    await axios.post('/bookspot', {
      email:this.state.email,
      docId: docId
    });
    this.getRecords();
  };

  cancelBooking = async (docId, email, lastWaitedEmail) => {
    await axios.post('/cancelbooking', {email:email, docId: docId});
    if(lastWaitedEmail){
      await axios.post('/bookspot', {email:lastWaitedEmail, docId: docId});
      await axios.post('/leavewaitinglist', {email:lastWaitedEmail, docId: docId});
    }
    this.getRecords();
  }

  createrow(){
    let records = this.state.records;
    console.log('records', records);
    let row=[];

    records.forEach(rec=>{
      const date = new Date(rec.available_date._seconds *1000).toLocaleDateString("en-US");
      const time = new Date(rec.available_date._seconds *1000).toLocaleTimeString("en-US");
      let dateTimeFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
      row.push(<div>)
      row.push(<tr key={rec.available_date._seconds}><td><h3 className="text-center" style={{marginTop:50}}>{dateTimeFormat.format(new Date(date.slice('/')))}, {time}</h3></td></tr>);
      row.push(</div>)
    })
  }

  render() {
    let records = this.state.records;
    let adminEmail = localStorage.getItem('email'); 
    let row=[];

    records.forEach(rec=>{
      const date = new Date(rec.available_date._seconds *1000).toLocaleDateString("en-US");
      const time = new Date(rec.available_date._seconds *1000).toLocaleTimeString("en-US");
      let dateTimeFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
      row.push(<div className="col-sm-12" key={rec.available_date._seconds} style={{backgroundColor:'#FBFAFB', padding:5}}><h3 className="text-center" style={{marginTop:50}}>{dateTimeFormat.format(new Date(date.slice('/')))},<br/> {time}</h3></div>);
      row.push(<div className="col-sm-6" key={rec.available_date._seconds + 'error'}><h5>{this.state.validationMsg}</h5></div>)
      for(let i=0; i<rec.space_number; i++){
        if(rec.reserved[i]){
          let lastWaitedEmail = (rec.waiting_list.length !== 0 ? rec.waiting_list[0]: null )
          row.push(<div className="row col-sm-8" key={rec.reserved[i]+rec.available_date._seconds}>
                        <div className="col-sm-6"> {rec.reserved[i]}</div><button className="text-center col-sm-5" style={{marginLeft:5, marginTop:2}} onClick={() => this.cancelBooking(rec.docId, rec.reserved[i], lastWaitedEmail)}>Remove booking</button></div>);
        }else
          row.push(<div className="row col-sm-8">
            <input 
            autoFocus
            type="email"
            className="col-sm-6"
            placeholder="Enter work email address"
            onChange={this.handleChange}
            ></input>
            <button className="text-center col-sm-5" style={{marginLeft:5, marginTop:2}} onClick={() => this.bookASpace(rec.docId)}>Book now</button></div>)
      }
      if(rec.waiting_list.length !== 0) {
        row.push(<div className="col-sm-6"><button className="col-sm-4" >waitlist({rec.waiting_list.length})</button></div>);
      }
    })

    return (
      <div className="container" style={{backgroundColor:'#F8F5F5'}}>
        <img className="rounded mx-auto d-block" style={{height:80, width: 300,marginBottom:10}} src={logo} alt="logo"/>
        <h4 className="text-center">{adminEmail}</h4>
       <div>{row}</div>
      </div>
    )
  }
}
