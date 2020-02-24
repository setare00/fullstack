import React, { Component } from 'react';
import axios from 'axios'; 
import logo from '../src/logo.png';

export default class Booking extends Component {

  constructor(props) {
    super(props);
    this.getRecords = this.getRecords.bind(this);
    this.state = {
      records:[],
      msg:null,
      docId:null
    }
  }

  

  async componentDidMount(){
  //  let email = await axios.post('/getuseremail', {uid:this.props.match.params.uid});
    this.getRecords();

  }

   async getRecords(){
    let recs = await axios.post('/getspots', {domain:this.props.match.params.domain});
    this.setState({records:recs.data});
   }

   bookASpace = async(docId)=>{   
    let email = localStorage.getItem('email');  
      await axios.post('/bookspot', {
        email:email,
        docId: docId
    });
    this.getRecords();
  };

  cancelBooking = async (docId, lastWaitedEmail) => {
    let email = localStorage.getItem('email');  

    await axios.post('/cancelbooking', {email:email, docId: docId});
    if(lastWaitedEmail){
      await axios.post('/bookspot', {email:lastWaitedEmail, docId: docId});
      await axios.post('/leavewaitinglist', {email:lastWaitedEmail, docId: docId});
    }
    this.getRecords();
  }

  joinWaitlist = async(docId) => {
    let email = localStorage.getItem('email');  
    await axios.post('/joinwaitinglist', {email:email, docId: docId});
    this.getRecords();
  }

  leaveWaitlist = async(docId) => {
    let email = localStorage.getItem('email');  
    await axios.post('/leavewaitinglist', {email:email, docId: docId});
    this.getRecords();
  }


  render() {
    let records = this.state.records;
    let email = localStorage.getItem('email');  
    // let docId = this.state.docId;
    // console.log('records', records);
    let row=[];

    records.forEach(rec=>{
      const date = new Date(rec.available_date._seconds *1000).toLocaleDateString("en-US");
      const time = new Date(rec.available_date._seconds *1000).toLocaleTimeString("en-US");
      let dateTimeFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
     
    row.push(<h3 className="text-center" key={rec.available_date._seconds} style={{backgroundColor:'#FBFAFB', padding:10}}>{dateTimeFormat.format(new Date(date.slice('/')))}<br/>{time}</h3>);
     
      for(let i=0; i<rec.space_number; i++){
        if(rec.reserved.length === 0)
          row.push(<div  className="row col-sm-6 text-center" style={{padding:5}}><div className="col-sm"><button onClick={() => this.bookASpace(rec.docId)}>Book now</button></div></div>)    
        else{
          if(rec.reserved.includes(email)){
            if(rec.reserved[i] && rec.reserved[i] === email){
              let lastWaitedEmail = (rec.waiting_list.length !== 0 ? rec.waiting_list[0]: null )
            row.push(<div className="row text-center"><div className="col-sm">{email}<button  onClick= {() => this.cancelBooking(rec.docId,lastWaitedEmail)}>Cancel</button></div><div className="col-sm-6 text_center" style={{color:'#1FC600'}}>{rec.access_code ?`Access code: ${rec.access_code}`:''}</div></div>)
            }else if(rec.reserved[i] && rec.reserved[i] !== email)
          row.push(<div className="col-sm-6 text-center">{rec.reserved[i]}</div>)
          else   row.push(<div className="col-sm-6 text-center">Empty</div>)
          }else{
            if(rec.reserved[i])
              row.push(<div  className="col-sm-6 text-center">{rec.reserved[i]}</div>)
            else
            row.push(<div className="col-sm-6 text-center" style={{padding:5}}><button  className="text-center" onClick={() => this.bookASpace(rec.docId)}>Book now</button></div>)
          }
        }  
      }
      if(parseInt(rec.reserved.length) === parseInt(rec.space_number)) {
        if(rec.waiting_list.includes(email))
        row.push(<div  className="col-sm-6 text-center" style={{padding:5}}><button onClick={() => this.leaveWaitlist(rec.docId)}>leave the waitlist({rec.waiting_list.length})</button></div>)
        else if(!rec.waiting_list.includes(email) && !rec.reserved.includes(email))
         row.push(<div  className="col-sm-6 text-center" style={{padding:5}}><button onClick={() => this.joinWaitlist(rec.docId)}>Join the waitlist({rec.waiting_list.length})</button></div>)

      }  
    
    })


    return (
      <div  className="container" style={{backgroundColor:'#F8F5F5'}}>
        <img className="rounded mx-auto d-block" style={{height:80, width: 300,marginBottom:10}} src={logo} alt="logo"/>
        <h4 className="text-center" style={{marginBottom:20}}>{email}</h4>
        <div> {row}</div>
      </div>
    )//return
  }
}
