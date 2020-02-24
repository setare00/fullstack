import React from 'react';
import {Route} from 'react-router-dom'; 
import Home from './Home';
import Booking from './Booking';
import Admin from './Admin';
import GenerateCodeForDay from './GenerateCodeForDay';



function  App() {
  return (
    <div>
     <Route path="/booking/:domain" component={Booking}></Route>
     <Route path="/admin/:domain" component={Admin}></Route>
     <Route path="/generatecodeforday" component={GenerateCodeForDay}></Route>
     <Route path="/" exact component={Home}></Route>
  </div>
  );
  
}

export default App;
