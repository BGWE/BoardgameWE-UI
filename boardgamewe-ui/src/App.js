import React, { Component } from 'react';
import PermanentDrawer from './MainApp';
import {MuiThemeProvider} from "material-ui";

import theme from './theme'
import './App.css';


class App extends Component {
  render() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <PermanentDrawer></PermanentDrawer>
            </div>
        </MuiThemeProvider>
    );
  }
}

export default App;
