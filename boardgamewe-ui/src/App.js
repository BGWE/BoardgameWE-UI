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
import ViewEventLayout from "./Events/ViewEventLayout";

axios.defaults.baseURL = Constants.API_ADDRESS;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false
        };
    }

  async componentDidMount() {
    axios.interceptors.response.use(response => {
        return response;
    }, 
    error => {
        if(error.response.status === 401) {
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

  setAuthenticated(val) {
    this.setState({authenticated: val});
  }

  render() {
        if(!this.state.authenticated) {
            return  <LoginLayout callbackAuthentication={() => this.setAuthenticated(true)} />
        }
        else {
            return (
                <MuiThemeProvider theme={theme}>
                    <div className="App">
                        <Switch>
                            <Route exact path="/register" component={LoginLayout} />
                            <Route exact path="/events/add" component={ViewEventLayout} />
                            <Route exact path="/events" render={routeProps => <EventsLayout {...routeProps} callbackLogout={() => this.setAuthenticated(false)} /> } />
                            <Route path="/event/:eventid" render={routeProps => <EventLayout {...routeProps} callbackLogout={() => this.setAuthenticated(false)} />} />
                            <Route path="/search/:name" component={SearchResults} />
                            <Route path="/" component={AppLayout} />
                        </Switch>
                    </div>
                </MuiThemeProvider>
          );
      }
  }
}

export default App;
