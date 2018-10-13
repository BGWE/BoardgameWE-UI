import React, { Component } from 'react';
import PermanentDrawer from './MainApp';
import {MuiThemeProvider} from "material-ui";

import theme from './theme'
import './App.css';

import {Constants} from "./utils/Constants.js";
import Login from "./User/Login.js";

import axios from "axios";
axios.defaults.baseURL = Constants.API_ADDRESS;


// TODO: traiter erreur 401 (filtre qui redirige sur page de connexion)
// TODO: traiter token


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
        if(error.response.status == "401") {
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
        return  <Login callbackAuthentication={() => this.setAuthenticated()} />
    }
    else {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <PermanentDrawer></PermanentDrawer>
                </div>
            </MuiThemeProvider>
        );
    }
  }
}

export default App;
