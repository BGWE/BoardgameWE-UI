import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {AppBar, Toolbar} from "material-ui";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};


class GamesToolBar extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <h1>Hey</h1>
                </AppBar>
            </div>
        );
    }

}


GamesToolBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GamesToolBar);
