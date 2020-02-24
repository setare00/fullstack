import React, { Component } from 'react';
import axios from 'axios'

export default class GenerateCodeForDay extends Component {
  constructor(props){
    super(props)
    this.state ={
      errMessage:null
    }
    this.getCode = this.getCode.bind(this);

  }

async componentDidMount(){
  if(! this.props.location.search)
    return this.setState({errMessage: 'Date not found'});
  let date = this.props.location.search.split('=')[1];
  // console.log(date);
 
  let year = date.slice(0,4);
  let month = date.slice(4,6);
  let day = date.slice(6);
  let res = await axios.post('/generatedaycode', {date: `${year}-${month}-${day}`});
  let {error} = res;
  // console.log('res',res)
  if(error){
    // console.log(error);
    return this.setState({errMessage: error});
  }
  this.setState({errMessage:'Done!'})
}

  render() {
    console.log(this.props.location.search);
    return (
      <div className="container">
        <h4>{this.state.errMessage}</h4>
      </div>
    )
  }
}
