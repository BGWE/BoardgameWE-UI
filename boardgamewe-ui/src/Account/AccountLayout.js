import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {CircularProgress} from "@material-ui/core";
import {Route, Switch} from "react-router-dom";
import ArrowBack from '@material-ui/icons/ArrowBack';
import AccountMenu from "../Layout/AccountMenu.js";

import UserModel from "../utils/api/User";

import ProfileManagementLayout from "./ProfileManagementLayout";
import LibraryLayout from "./LibraryLayout";
import HomeButton from "../utils/HomeButton";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    icon: {
        marginRight: theme.spacing.unit * 2,
        cursor: "pointer"
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    }
});

class AccountLayout extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            user: null,
        }
    }

    async componentWillMount() {
        let user = await UserModel.fetchCurrent();
        this.setState({user, ...user});
    }


    render() {
        const { classes } = this.props;

        if(this.state.user === null) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }

        return (
            <React.Fragment>
                <CssBaseline />
                <div className={classes.root}>
                    <AppBar position="absolute" className={classes.appBar}>
                        <Toolbar>
                            <ArrowBack className={classes.icon} onClick={this.props.history.goBack} />
                            <HomeButton/>
                            <div>
                                <Typography variant="h6" color="inherit" noWrap>
                                    Accout management
                                </Typography>
                            </div>
                            <AccountMenu callbackLogout={this.props.callbackLogout}/>
                        </Toolbar>
                    </AppBar>
                    <main className={classes.content}>
                        <div className={classes.toolbarSpace} />
                        <Switch>
                            <Route path="/account/profile" render={routeProps => <ProfileManagementLayout {...routeProps} user={this.state.user} /> }/>
                            <Route path="/account/library" render={routeProps => <LibraryLayout {...routeProps} user={this.state.user} /> }/>
                        </Switch>
                    </main>
                </div>
            </React.Fragment>
        );
    }
}

AccountLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountLayout);