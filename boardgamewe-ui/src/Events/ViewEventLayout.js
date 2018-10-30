import React from "react";
import {Redirect} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

import Avatar from "@material-ui/core/Avatar/Avatar";
import EventNoteIcon from "@material-ui/icons/EventNote";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import TextField from "@material-ui/core/TextField/TextField";

import EventModel from "../utils/api/Event";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    icon: {
        margin: theme.spacing.unit,
        fontSize: 32,
    },
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 150,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        width: theme.spacing.unit * 20,
    }
});

class ViewEventLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToEvents: false,

            name: '',
            location: '',
            startDate: '',
            endDate: '',
            description: '',

            nameValid: true,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    static convertToISO(stringDate) {
        let date = new Date(stringDate);
        console.log(date);
        console.log(date.toISOString());
        return date.toISOString()
    }

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        // console.log(name);
        // console.log(value);

        this.setState({[name]: value},
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let nameValid = this.state.nameValid;

        switch(fieldName) {
            case 'name':
                nameValid = value.length > 0;
                break;
            default:
                break;
        }
        this.setState({
            nameValid: nameValid,
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        // Convert dates
        let start = ViewEventLayout.convertToISO(this.state.startDate);
        let end = ViewEventLayout.convertToISO(this.state.endDate);

        let data = await new EventModel({
            name: this.state.name,
            location: this.state.location,
            start,
            end,
            description: this.state.description
        }).save();

        console.log(data);

        setTimeout(() => this.setState({redirectToEvents: true}), 800);

        return false;
    };

    render() {
        if (this.state.redirectToEvents) {
            return (<Redirect to="/events" />)
        }
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <React.Fragment>
                    <CssBaseline />

                    <main className={classes.layout}>
                        <Paper className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <EventNoteIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Event
                            </Typography>
                            <form className={classes.form} onSubmit={this.handleSubmit}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="name">Name</InputLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        value={this.state.name}
                                        onChange={this.handleInputChange}
                                        error={!this.state.nameValid}
                                    />
                                </FormControl>

                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="location">Location</InputLabel>
                                    <Input
                                        id="location"
                                        name="location"
                                        autoComplete="location"
                                        value={this.state.location}
                                        onChange={this.handleInputChange}
                                    />
                                </FormControl>

                                <FormControl margin="normal" required >
                                    <TextField
                                        id="startDate"
                                        name="startDate"
                                        label="Start date"
                                        type="datetime"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={this.state.startDate}
                                        onChange={this.handleInputChange}
                                    />
                                </FormControl>

                                <FormControl margin="normal" required >
                                    <TextField
                                        id="endDate"
                                        name="endDate"
                                        label="End date"
                                        type="datetime"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={this.state.endDate}
                                        onChange={this.handleInputChange}
                                    />
                                </FormControl>

                                <FormControl margin="normal" fullWidth>
                                    <InputLabel htmlFor="description">Description</InputLabel>
                                    <Input
                                        id="description"
                                        name="description"
                                        autoComplete="description"
                                        value={this.state.description}
                                        onChange={this.handleInputChange}
                                    />
                                </FormControl>


                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.handleSubmit}
                                    // disabled={!this.state.formValid}
                                >
                                    Add
                                </Button>

                            </form>
                        </Paper>
                    </main>

                </React.Fragment>
            </div>

        )
    }
}

ViewEventLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewEventLayout);