import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";

const styles = theme => ({
    root: {
        width: '100%',
    },
});

class MenuItem extends React.Component{


    render() {
        return (
            <Link style={{ textDecoration: 'none' }} to={this.props.uri} onClick={this.props.onClick}>
                <ListItem button>
                    <ListItemText primary={this.props.name} primaryTypographyProps={{variant:"overline"}} />
                </ListItem>
            </Link>
        )
    }
}

MenuItem.propTypes = {
    name: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
};

export default withStyles(styles)(MenuItem);