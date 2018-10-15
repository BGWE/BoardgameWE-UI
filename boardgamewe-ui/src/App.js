import React, { Component } from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import AppLayout from "./AppLayout";
import LoginLayout from "./Login/LoginLayout";
import EventsLayout from "./Events/EventsLayout";
import EventLayout from "./Event/EventLayout";

import theme from './theme';
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import SearchResults from "./Boardgames/SearchResults/SearchResults";
import axios from "axios";
import {Constants} from "./utils/Constants.js";
import Login from "./User/Login.js";

axios.defaults.baseURL = Constants.API_ADDRESS;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false
        };
    }

  async componentDidMount() {
    console.log("mount");
    axios.interceptors.response.use(response => {
        return response;
    }, 
    error => {
        if(error.response.status === "401") {
            this.setState({authenticated: false});
        }
        error.message += " - Response data: " + JSON.stringify(error.response.data);
        return Promise.reject(error);
    });

    let token = window.localStorage.accessToken;
    if(token != null) {
        axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
        this.setState({authenticated: true});
    }
  }

  setAuthenticated() {
    this.setState({authenticated: true});
  }

  render() {
        if(!this.state.authenticated) {
            return  <LoginLayout callbackAuthentication={() => this.setAuthenticated()} />
        }
        else {
            return (
                <MuiThemeProvider theme={theme}>
                    <div className="App">
                        <Switch>
                            <Route exact path="/login" component={LoginLayout} />
                            <Route exact path="/register" component={LoginLayout} />
                            <Route exact path="/events" component={EventsLayout} />
                            <Route path="/event/:eventid" component={EventLayout} />
                            <Route path="/search/:name" component={SearchResults}/>
                            <Route path="/" component={AppLayout} />
                        </Switch>
                    </div>
                </MuiThemeProvider>
          );
      }
  }
}

export default App;
