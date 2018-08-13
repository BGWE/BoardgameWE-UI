import React from 'react';
import {AppBar, withStyles} from "material-ui";
import {Redirect} from "react-router";

const styles = {
    appBar: {
        color: 'white'
    }
};

class Home extends React.Component {

    render() {
        return (
            <Redirect to="/boardgames"/>
        );
    }
}

export default withStyles(styles)(Home);
