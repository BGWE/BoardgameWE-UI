import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import HomeIcon from '@material-ui/icons/Home';
import IconButton from "@material-ui/core/IconButton/IconButton";
import {Redirect} from "react-router-dom";
import Typography from "@material-ui/core/Typography/Typography";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    icon: {
        color: "white"
    },
    homeIcon: {
        marginRight: theme.spacing.unit * 1,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    }
});

class HomeButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectHome: false
        };

        this.goToHome = this.goToHome.bind(this);
    }

    goToHome() {
        this.setState({
            redirectHome: true
        })
    }

    render() {
        const { classes } = this.props;

        if (this.state.redirectHome) {
            return <Redirect to='/'/>
        }

        return (
            <Tooltip title="Home">
                <IconButton
                    className={classes.homeIcon}>
                    <HomeIcon
                        color="inherit"
                        className={classes.icon}
                        onClick={this.goToHome}
                    />
                </IconButton>
            </Tooltip>

        );
    }
}

HomeButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeButton);