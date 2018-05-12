import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {AppBar, Button, IconButton, Toolbar, Typography} from "material-ui";
import AddGame from "../AddGame/AddGameModal";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        "margin-left": "auto",
        "margin-right": "10px",
    },
};


class GamesToolBar extends React.Component {

    render() {
        const { classes } = this.props;

        return (
                <AppBar position="static">
                    <Toolbar>
                        {/*<Button variant="raised" color="secondary" className={classes.menuButton}>Add</Button>*/}
                        <AddGame ></AddGame>
                    </Toolbar>
                </AppBar>
        );
    }

}


GamesToolBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GamesToolBar);
