import React from "react";
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";

import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import axios from "axios";

const styles = theme => ({
    grow: {
        flexGrow: 1,
        textAlign: 'right'
    }
});


class AccountMenu extends React.Component{
    constructor(props, context) {
        super(props, context);


        this.state = {
            anchor: null,
        }
    }

    handleMenu = event => {
        this.setState({anchor: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchor: null});
    };

    logout = () => {
        delete axios.defaults.headers.common['Authentication'];
        window.localStorage.removeItem("accessToken");
        this.props.callbackLogout();
    };

    render() {
        const { classes } = this.props;
        const { anchor } = this.state;
        const opened = Boolean(anchor);

        return (
            <div className={classes.grow}>
                <IconButton
                    aria-owns={opened ? 'menu-account' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-account"
                    anchorEl={anchor}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={opened}
                    onClose={this.handleClose}
                >
                    <Link style={{ textDecoration: 'none' }} to="/account/profile" onClick={this.handleClose}>
                        <MenuItem>Profile</MenuItem>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} to="/account/library" onClick={this.handleClose}>
                        <MenuItem>My library</MenuItem>
                    </Link>
                    <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
            </div>
        )
    }
}

export default withStyles(styles)(AccountMenu);