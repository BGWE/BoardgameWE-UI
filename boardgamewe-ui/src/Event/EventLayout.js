import React from "react";
import {Route, Switch} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider/Divider";

import {menuItemsList} from "./Menu/MenuItemsList";
import {CircularProgress} from "@material-ui/core";
import MenuItem from "./Menu/MenuItem";
import Boardgame from "../Boardgames/Boardgame/Boardgame";
import Boardgames from "../Boardgames/Boardgames";
import Games from "../Games/Games";
import AddGame from "../Games/AddGame";
import Rankings from "../Rankings/Rankings";
import EventModel from "../utils/api/Event";
import AccountMenu from "../Layout/AccountMenu.js";
import Dashboard from "./Dashboard";


const styles = theme => ({
    root: {
        width: '100%',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    drawerOpen: {
        paddingTop: theme.spacing.unit * 8
    },
    toolbar: theme.mixins.toolbar,
});

class EventLayout extends React.Component{

    constructor(props, context) {
        super(props, context);


        this.state = {
            menuOpen: false,
            eventName: "",
            event_model: null,
            isLoading: true
        }
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        try {
            let event_model = await EventModel.fetch(this.props.match.params.eventid);
            this.setState({
                event_model,
                isLoading: false
            });
        } catch (e) {
            console.log("Failed to fetch event " + this.props.match.params.eventid);
            console.log(e);
        }
    }


    handleDrawerOpen = () => {
        this.setState({
            menuOpen: true
        });
    };

    handleDrawerClose = () => {
        this.setState({
            menuOpen: false
        });
    };

    render() {
        const { classes } = this.props;

        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }

        let menuItems = [];
        for (var uriKey in menuItemsList) {
            let uri = uriKey;
            if (uriKey === '/') {
                uri = ''
            }
            menuItems.push((<MenuItem key={uriKey} uri={this.props.match.url + uri} name={menuItemsList[uriKey]} onClick={this.handleDrawerClose} />))
        }

        return (
            <div className={classes.root}>
                <Drawer className={classes.drawerOpen} open={this.state.menuOpen} onClose={this.handleDrawerClose}>
                    <div
                        tabIndex={0}
                        role="button"
                        className={classes.drawerOpen}
                    >
                        <Divider/>
                        {menuItems}
                        <Divider/>
                        <MenuItem
                            key={"/"}
                            uri={"/"}
                            name={"Other events"}
                            onCLick={this.handleDrawerClose}
                        />
                    </div>
                </Drawer>
                <AppBar>
                    <Toolbar disableGutters={true}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            {this.state.event_model ? this.state.event_model.name : ""}
                        </Typography>
                        <AccountMenu callbackLogout={this.props.callbackLogout}/>
                    </Toolbar>
                </AppBar>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route path={`${this.props.match.path}/boardgames`} render={() => <Boardgames {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/games/add`} render={() => <AddGame {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/games`} render={() => <Games {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/rankings`} render={() => <Rankings {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/`} render={() => <Dashboard {...this.props} eventModel={this.state.event_model}/> } />
                    </Switch>
                </main>
            </div>
        )
    }
}

EventLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventLayout);