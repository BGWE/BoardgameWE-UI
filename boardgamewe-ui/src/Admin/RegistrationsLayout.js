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
        maxWidth: 500,
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

        let undefinedValidate = (user_id) => {
            return (
            <ListItemSecondaryAction>
                <Button variant="outlined" color="primary" className={classes.button} onClick={() => {this.handleValidationButtons(user_id, true)}}>
                    Approve
                </Button>
                <Button variant="outlined" color="secondary" className={classes.button} onClick={() => {this.handleValidationButtons(user_id, false)}}>
                    Reject
                </Button>
            </ListItemSecondaryAction>
        )};

        let userValidated = (user_id) => {
            return (
                <ListItemSecondaryAction>
                    <Button variant="outlined" color="secondary" className={classes.button} onClick={() => {this.handleValidationButtons(user_id, false)}}>
                        Reject
                    </Button>
                </ListItemSecondaryAction>
            )};

        let userRejected = (user_id) => {
            return (
                <ListItemSecondaryAction>
                    <Button variant="outlined" color="primary" className={classes.button} onClick={() => {this.handleValidationButtons(user_id, true)}}>
                        Approve
                    </Button>
                </ListItemSecondaryAction>
            )};

        let generateSecondaryAction = (validated, id) => {
          if (validated === null) {
              return undefinedValidate(id)
          } else if (validated) {
              return userValidated(id)
          } else {
              return userRejected(id)
          }
        };

        let generatedSecondaryText = (validated, admin) => {
            if (admin) {
                return "Admin"
            } else if (validated === null) {
                return "Not registered"
            } else if (validated) {
                return "Registered"
            } else {
                return "Rejected"
            }
        };

        let list = (
            <div className={classes.usersList}>
                <List>
                    {this.state.users.map(value => (
                        <ListItem key={value.id} divider>
                            <ListItemText
                                primary={`${value.name} ${value.surname}`}
                                secondary={generatedSecondaryText(value.validated, value.admin)}
                            />
                            {generateSecondaryAction(value.validated, value.id)}

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