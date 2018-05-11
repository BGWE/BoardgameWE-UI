import React from 'react';
import {AppBar, Toolbar, Typography, withStyles} from "material-ui";

const styles = {
    appBar: {
        color: 'white'
    }
};

class Home extends React.Component {

    render() {
        return (
            <div>
                <AppBar
                    position="absolute"
                    className={this.props.classes.appBar}
                >
                    <h1>Coucou</h1>
                </AppBar>
            </div>


        );
    }
}

export default withStyles(styles)(Home);
