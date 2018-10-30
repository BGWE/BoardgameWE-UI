import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from "react-router-dom";
import Event from "../utils/api/Event";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Button from "@material-ui/core/Button/Button";
import AccountMenu from "../Layout/AccountMenu.js";
import EventIcon from '@material-ui/icons/Event';
import EventCard from "./EventCard";
import CustomizedSnackbar from "../utils/UI/Snackbar";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    icon: {
        marginRight: theme.spacing.unit * 2,
    },
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
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

class EventsLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            attendedEvents: [],

            eventJoinSuccessSnackbarOpen: false,
            eventJoinFailureSnackbarOpen: false,
        };

        this.goToEvent = this.goToEvent.bind(this);
        this.joinEvent = this.joinEvent.bind(this);
    }

    componentDidMount() {
        this.loadEvents();
        this.loadAttendedEvents();
    }

    async loadEvents() {
        let events = await Event.fetchAll();
        console.log(events);
        this.setState({
            events: events
        })
    }

    async loadAttendedEvents() {
        let attendedEvents = await Event.fetchAttendedEvents();
        console.log(attendedEvents);
        this.setState({
            attendedEvents: attendedEvents
        })
    }

    isCurrentUserAttendsEvent(event) {
        return this.state.attendedEvents.some((attendedEvent) => (attendedEvent.id === event.id))
    }

    goToEvent(event) {
        this.props.history.push('/event/' + event.id)
    }

    joinEvent(event) {
        event.subscribe()
            .then((data) => {
                console.log("Data");
                console.log(data);
                if ("success" in data && data["success"]) {
                    this.setState({
                        eventJoinSuccessSnackbarOpen: true
                    });

                    setTimeout(() => this.goToEvent(event), 600);
                } else {
                    this.setState({
                        eventJoinFailureSnackbarOpen: true
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    eventJoinFailureSnackbarOpen: true
                });
            });

        this.loadEvents();
        this.loadAttendedEvents();
    }

    handleCloseSnackbar = () => {
        this.setState({
            eventJoinSuccessSnackbarOpen: false,
            eventJoinFailureSnackbarOpen: false,
        });
    };

    render() {
        const { classes } = this.props;

        let eventJoinSuccessSnackbar = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="success"
                message={`You've successfully joined the event.`}
                open={this.state.eventJoinSuccessSnackbarOpen}
                autoHideDuration={600}
            />
        );

        let eventJoinFailureSnackbar = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="error"
                message={`Error happened while joining the event...`}
                open={this.state.eventJoinFailureSnackbarOpen}
                autoHideDuration={600}
            />
        );

        return (
            <div className={classes.root}>
                <React.Fragment>
                    <CssBaseline />
                    <AppBar position="static" className={classes.appBar}>
                        <Toolbar>
                            <EventIcon className={classes.icon} />
                            <Typography variant="h6" color="inherit" noWrap>
                                Event selection
                            </Typography>
                            <AccountMenu callbackLogout={this.props.callbackLogout}/>
                        </Toolbar>
                    </AppBar>

                    {eventJoinSuccessSnackbar}

                    <main>
                        {/* Hero unit */}
                        <div className={classes.heroUnit}>
                            <div className={classes.heroContent}>
                                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                    Board Game Events
                                </Typography>
                                <Typography variant="h6" align="center" color="textSecondary" paragraph>
                                    Choose the event in which you're going to participate. Or create one. Or even join one. The possibilities are endless.
                                </Typography>
                                <div className={classes.heroButtons}>
                                    <Grid container spacing={16} justify="center">
                                        <Grid item>
                                            <Link to={`${this.props.match.url}/add`} className={classes.button}>
                                                <Button variant="contained" color="primary">
                                                    Create an event
                                                </Button>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                        <div className={classNames(classes.layout, classes.cardGrid)}>
                            {/* End hero unit */}
                            <Grid container spacing={40}>
                                {this.state.events.map(event => {
                                    if (this.isCurrentUserAttendsEvent(event)) {
                                        return <EventCard
                                                    key={event.id}
                                                    event={event}
                                                    viewCb={this.goToEvent}
                                                    attended/>
                                    } else {
                                        return <EventCard
                                                    key={event.id}
                                                    event={event}
                                                    viewCb={this.goToEvent}
                                                    joinCb={this.joinEvent}/>
                                    }
                                })}
                            </Grid>
                        </div>
                    </main>

                </React.Fragment>
            </div>
        )
    }
}

EventsLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventsLayout);