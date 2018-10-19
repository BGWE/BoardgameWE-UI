import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import {menuItemsList} from "./Menu/MenuItemsList";
import MenuItem from "./Menu/MenuItem";
import {Route, Switch} from "react-router-dom";
import Boardgame from "../Boardgames/Boardgame/Boardgame";
import BoardgamesList from "../Boardgames/BoardgamesList/BoardgamesList";
import Players from "../Players/Players";
import Games from "../Games/Games";
import AddGame from "../Games/AddGame";
import Rankings from "../Rankings/Rankings";

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
            eventName: ""
        }
    }

    componentDidMount() {
        // TODO Get event name from id (this.props.match.params.eventid)
        this.setState({
            eventName: "Week End"
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
                    </div>
                </Drawer>
                <AppBar
                >
                    <Toolbar disableGutters={true}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            {this.state.eventName}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route path={`${this.props.match.path}/boardgames`} component={BoardgamesList} />
                        <Route path={`${this.props.match.path}/boardgame/:bgid`} component={Boardgame} />
                        <Route path={`${this.props.match.path}/players`} component={Players} />
                        <Route path={`${this.props.match.path}/games/add`} component={AddGame} />
                        <Route path={`${this.props.match.path}/games`} component={Games} />
                        <Route path={`${this.props.match.path}/rankings`} component={Rankings} />
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