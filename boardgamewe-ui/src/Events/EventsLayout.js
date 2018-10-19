import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Link} from "react-router-dom";
import Event from "../utils/api/Event";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import CardActions from "@material-ui/core/CardActions/CardActions";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Button from "@material-ui/core/Button/Button";

import EventIcon from '@material-ui/icons/Event';
import CardHeader from "@material-ui/core/CardHeader/CardHeader";

// const styles = theme => ({
//     root: {
//         width: '100%',
//         maxWidth: 360,
//         backgroundColor: theme.palette.background.paper,
//     },
// });

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
    }
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class EventsLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events: []
        }
    }

    componentDidMount() {
        this.loadEvents()
    }

    async loadEvents() {
        let data = await Event.fetchAllEvents();
        console.log(data);
        this.setState({
            events: data.events
        })
    }

    goToEvent(id) {
        this.props.history.push('/event/' + id)
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {/*<List component="nav">*/}
                    {/*<Link to="/event/1">*/}
                        {/*<ListItem button>*/}
                            {/*<ListItemText primary="Event 1" />*/}
                        {/*</ListItem>*/}
                    {/*</Link>*/}

                    {/*<ListItem button>*/}
                        {/*<ListItemText primary="Event 2" />*/}
                    {/*</ListItem>*/}
                {/*</List>*/}
                {/*<Divider />*/}
                {/*<List component="nav">*/}
                    {/*<ListItem button>*/}
                        {/*<ListItemText primary="Trash" />*/}
                    {/*</ListItem>*/}
                    {/*<ListItem button component="a" href="#simple-list">*/}
                        {/*<ListItemText primary="Spam" />*/}
                    {/*</ListItem>*/}
                {/*</List>*/}

                <React.Fragment>
                    <CssBaseline />
                    <AppBar position="static" className={classes.appBar}>
                        <Toolbar>
                            <EventIcon className={classes.icon} />
                            <Typography variant="h6" color="inherit" noWrap>
                                Event selection
                            </Typography>
                        </Toolbar>
                    </AppBar>
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
                                {this.state.events.map(event => (
                                    <Grid item key={event.id} sm={6} md={4} lg={3}>
                                        <Card className={classes.card}>
                                            {/*<CardMedia*/}
                                                {/*className={classes.cardMedia}*/}
                                                {/*image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len*/}
                                                {/*title="Image title"*/}
                                            {/*/>*/}
                                            <CardHeader
                                                className={classes.cardHeader}
                                                title={
                                                    (<Typography variant="overline" className={classes.title}>
                                                        {event.location}
                                                    </Typography>)
                                                }/>
                                            <CardContent className={classes.cardContent}>
                                                <Typography className={classes.dateHeader} variant="subheading">
                                                    {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
                                                </Typography>
                                                <Typography>
                                                    {event.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => this.goToEvent(event.id)}>
                                                    Select
                                                </Button>
                                                {/*<Button size="small" color="primary">*/}
                                                    {/*Edit*/}
                                                {/*</Button>*/}
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
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