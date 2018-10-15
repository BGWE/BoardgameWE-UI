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

class App extends Component {
  render() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <Switch>
                    <Route exact path="/login" component={LoginLayout} />
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

export default App;
