import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from "@material-ui/core/Typography/Typography";
import User from "../utils/api/User";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import Button from "@material-ui/core/Button/Button";


const styles = theme => ({
    root: {
        // display: 'flex',
    },
    title: {
        width: '100%'
    },
    usersList: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class RegistrationsLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            error: false,
            errorMsg: ""
        };

        this.reload = this.reload.bind(this);
    }

    async componentDidMount() {
        this.reload()
    }

    async reload() {
        let data = [];
        try {
            data = await User.fetchUsers();
        } catch (e) {
            if (e.response.status > 299) {
                this.setState({
                    error: true,
                    errorMsg: e.response.data.message
                })
            }
        }
        console.log(data);
        this.setState({
            users: data.sort((a,b) => {
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            })
        })
    }

    async handleValidationButtons(user_id, validate) {
        let response = await User.setUserValidation(user_id, validate);
        console.log(response);
        setTimeout(this.reload, 700);
    }


    render() {
        const { classes } = this.props;

        let secondaryAction = (user_id) => {
            return (
            <ListItemSecondaryAction>
                <Button variant="outlined" color="primary" className={classes.button} onClick={() => {this.handleValidationButtons(user_id, true)}}>
                    Accept
                </Button>
                {/*<Button variant="outlined" color="secondary" className={classes.button} onClick={() => {this.handleValidationButtons(user_id, false)}}>*/}
                    {/*Refuse*/}
                {/*</Button>*/}
            </ListItemSecondaryAction>
        )};

        let rejectAction = (user_id) => {
            return (
                <ListItemSecondaryAction>
                    <Button variant="outlined" color="secondary" className={classes.button} onClick={() => {this.handleValidationButtons(user_id, false)}}>
                        Reject
                    </Button>
                </ListItemSecondaryAction>
            )};

        let list = (
            <div className={classes.usersList}>
                <List>
                    {this.state.users.map(value => (
                        <ListItem key={value.id} divider>
                            <ListItemText primary={`${value.name} ${value.surname} ${value.admin ? "(admin)" : ""}`} />
                            {!value.validated ? secondaryAction(value.id) : rejectAction(value.id)}
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        let error = (
            <Typography variant="h6" gutterBottom>
                {this.state.errorMsg}
            </Typography>
        );

        return (
            <React.Fragment>
                <CssBaseline />
                <div className={classes.root}>
                    <div className={classes.title}>
                        <Typography variant="h3" gutterBottom>
                            User registration
                        </Typography>
                    </div>

                    {this.state.error ? error : list}

                </div>
            </React.Fragment>
        );
    }
}

RegistrationsLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistrationsLayout);