import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Link} from "react-router-dom";

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class EventsLayout extends React.Component{
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List component="nav">
                    <Link to="/event/1">
                        <ListItem button>
                            <ListItemText primary="Event 1" />
                        </ListItem>
                    </Link>

                    <ListItem button>
                        <ListItemText primary="Event 2" />
                    </ListItem>
                </List>
                <Divider />
                <List component="nav">
                    <ListItem button>
                        <ListItemText primary="Trash" />
                    </ListItem>
                    <ListItem button component="a" href="#simple-list">
                        <ListItemText primary="Spam" />
                    </ListItem>
                </List>
            </div>
        )
    }
}

EventsLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventsLayout);