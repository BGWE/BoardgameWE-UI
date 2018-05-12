import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

import { menuItems } from './menuItems';

import Home from './Home/Home'
import { Route } from "react-router-dom";
import Boardgames from "./Boardgames/Boardgames";
import SearchResults from "./Boardgames/SearchResults/SearchResults";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appFrame: {
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
    },
    'appBar-left': {
        marginLeft: drawerWidth,
    },
    'appBar-right': {
        marginRight: drawerWidth,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});

class PermanentDrawer extends React.Component {
    state = {
        anchor: 'left',
    };

    handleChange = event => {
        this.setState({
            anchor: event.target.value,
        });
    };

    render() {
        console.log(this.props);
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>

                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        anchor="left"
                    >
                        <div className={classes.toolbar} />
                        <Divider />
                        <List>{menuItems}</List>
                    </Drawer>
                    <main className={classes.content}>
                        {/*<div className={classes.toolbar} />*/}
                        {/*<Typography>{'You think water moves fast? You should see ice.'}</Typography>*/}
                        <Route exact={true} path="/" component={Home}/>
                        <Route path="/search/:name" component={SearchResults}/>
                        <Route path="/boardgames" component={Boardgames}/>

                    </main>
                </div>
            </div>
        );
    }
}

PermanentDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermanentDrawer);