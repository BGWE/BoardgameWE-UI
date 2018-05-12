import React from 'react';
import {AppBar, withStyles} from "material-ui";

const styles = {
    appBar: {
        color: 'white'
    }
};

class Home extends React.Component {

    render() {
        return (
            <div>

                <div>
                    <p>11111</p>
                    <p>2222</p>
                    <p>33333</p>
                    <p>44444</p>
                </div>
            </div>


        );
    }
}

export default withStyles(styles)(Home);
