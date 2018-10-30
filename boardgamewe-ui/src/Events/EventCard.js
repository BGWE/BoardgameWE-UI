import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from "react-router-dom";
import Event from "../utils/api/Event";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import CardActions from "@material-ui/core/CardActions/CardActions";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Button from "@material-ui/core/Button/Button";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';

import EventIcon from '@material-ui/icons/Event';
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import User from "../utils/api/User";
import * as Helper from "../utils/Helper";

const styles = theme => ({
    icon: {
        marginRight: theme.spacing.unit * 2,
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing.unit * 6,
    },
    cardHeader: {
        backgroundColor: "#56595C",
        height: theme.spacing.unit * 13
    },
    title: {
        color: "white",
        fontSize: "12pt"
    },
    dateHeader: {
        fontSize: "12pt",
        marginBottom: theme.spacing.unit * 1,
        fontStyle: "italic",
        color: "#56595C",
    },
    button: {
        textDecoration: "none"
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});

class EventCart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }


    render() {
        const { classes, event, viewCb, joinCb, attended } = this.props;
        return (
            <Grid item key={event.id} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                    <CardHeader
                        className={classes.cardHeader}
                        title={
                            (<Typography variant="overline" className={classes.title}>
                                {event.location}
                            </Typography>)
                        }/>
                    <CardContent className={classes.cardContent}>
                        <Typography className={classes.dateHeader} variant="subheading">
                            {Helper.formatDatetime(event.start)} - {Helper.formatDatetime(event.end)}
                        </Typography>
                        <Typography>
                            {event.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant={"outlined"}
                            onClick={() => viewCb(event)}
                            size="small">
                            <VisibilityIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                            View
                        </Button>
                        {
                            attended ?
                                <Button
                                    color="primary"
                                    variant={"contained"}
                                    size="small"
                                    disabled>
                                    Joined
                                </Button>

                                :

                                <Button
                                    color="primary"
                                    variant={"contained"}
                                    onClick={() => joinCb(event)}
                                    size="small">
                                    <GroupAddIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                    Join
                                </Button>
                        }

                    </CardActions>

                </Card>
            </Grid>
        )
    }
}

EventCart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventCart);