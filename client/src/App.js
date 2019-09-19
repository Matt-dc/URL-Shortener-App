import React, { Component } from 'react';
import Shortener from './components/Shortener'
import Error from './components/Error'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import './App.css';

class App extends Component {

  state={}

  render() {


    return (


      <div className="App">

      <Router>
        <Switch>
          <Route exact path="/" component={Shortener} /> 
          <Route exact path="*" component={Error} /> 
        </Switch>
      </Router> 

          {/* {this.state.string}
      {this.state.falseUrl ? "false" : 'true'} */}

      </div>
    );
  }
}

export default App;
