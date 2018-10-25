import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import {menuItemsList, secondaryItemsList} from "./Menu/MenuItemsList";
import MenuItem from "./Menu/MenuItem";
import {Route, Switch} from "react-router-dom";
import Boardgame from "../Boardgames/Boardgame/Boardgame";
import BoardgamesList from "../Boardgames/BoardgamesList/BoardgamesList";
import Players from "../Players/Players";
import Games from "../Games/Games";
import AddGame from "../Games/AddGame";
import Rankings from "../Rankings/Rankings";
import EventModel from "../utils/api/Event";
import Divider from "@material-ui/core/Divider/Divider";

const styles = theme => ({
    root: {
        width: '100%',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
});

class EventLayout extends React.Component{

    constructor(props, context) {
        super(props, context);


        this.state = {
            menuOpen: false,
            eventName: "",
            event_model: null
        }
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        // this.setState()
        let event_model = null;
        try {
            event_model = await EventModel.fetch(this.props.match.params.eventid);
        } catch (e) {
            console.log("Failed to fetch event " + this.props.match.params.eventid);
            console.log(e);
        }

        this.setState({
            event_model: event_model
        });
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

        let menuItems = [];
        for (var uri in menuItemsList) {
            menuItems.push((<MenuItem key={uri} uri={this.props.match.url + uri} name={menuItemsList[uri]} onClick={this.handleDrawerClose} />))
        }

        return (
            <div className={classes.root}>
                <Drawer open={this.state.menuOpen} onClose={this.handleDrawerClose}>
                    <div
                        tabIndex={0}
                        role="button"
                    >
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
                    </Toolbar>
                </AppBar>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route path={`${this.props.match.path}/boardgames`} render={() => <BoardgamesList {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/boardgame/:bgid`} render={() => <Boardgame {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/games/add`} render={() => <AddGame {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/games`} render={() => <Games {...this.props} eventModel={this.state.event_model}/> } />
                        <Route path={`${this.props.match.path}/rankings`} render={() => <Rankings {...this.props} eventModel={this.state.event_model}/> } />
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