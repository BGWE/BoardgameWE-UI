import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {Link} from "react-router-dom";

import DashboardIcon from '@material-ui/icons/Dashboard';
import RankingsIcon from '@material-ui/icons/Timeline';
import BoardGamesIcon from '@material-ui/icons/Casino';
import GamesIcon from '@material-ui/icons/Assignment';
import PlayersIcon from '@material-ui/icons/People';
import EventsIcon from '@material-ui/icons/TableChart';

const styles = theme => ({
    root: {
        width: '100%',
    },
});

class MenuItem extends React.Component{

    constructor(props) {
        super(props);

        this.chooseIcon = this.chooseIcon.bind(this);
    }

    chooseIcon() {
        switch(this.props.name){
            case 'Dashboard':
                return <DashboardIcon />;
            case 'Rankings':
                return <RankingsIcon />;
            case 'Games':
                return <GamesIcon />;
            case 'Board Games':
                return <BoardGamesIcon/>;
            case 'Players':
                return <PlayersIcon/>;
            case 'Other events':
                return <EventsIcon/>;
            default:
                break;
        }
    }

    render() {
        return (
            <Link style={{ textDecoration: 'none' }} to={this.props.uri} onClick={this.props.onClick}>
                <ListItem button>
                    <ListItemIcon> {this.chooseIcon()} </ListItemIcon>
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