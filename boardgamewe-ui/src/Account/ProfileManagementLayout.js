import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CustomizedSnackbar from "../utils/UI/Snackbar";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    width: "500px",
    margin:"auto",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
  textField: {
    width: "90%",
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class ProfileManagementLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbarOpen: false,
            snackbarMessage: "",
            snackbarVariant: "error",
            
            user: {},
            username: "",
            email: "",
            surname: "",
            name: "",
            // oldPassword: "",
            newPassword: "",
            confirmPassword: "",

            fieldsValidity: {
                username: true,
                password: true,
                // oldPassword: true,
                confirmPassword: true,
                email: true,
                surname: true,
                name: true
            },
            formErrors: {
                username: '',
                password: '',
                // oldPassword: '', 
                confirmPassword: '',
                email: '',
                surname: '',
                name: ''
            },

            formValid: true,

            showErrors:false
        };

        this.minPwdLenth = 8;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }

    async componentWillMount() {
        this.setState({...this.props.user});
    }

    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            this.setState({...this.props.user});
        }
    }

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value}, this.validateField(name, value));
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let fieldsValidity = this.state.fieldsValidity;
        let valid;


        switch(fieldName) {
            case 'name':
            case 'surname':
            case 'username':
                valid = value.length > 0;
                fieldsValidity[fieldName] = valid;
                fieldValidationErrors[fieldName] = valid ? '' : 'Cannot be empty';
                break;
            case 'email':
                fieldsValidity.email = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = fieldsValidity.email ? '' : 'Invalid format';
                break;
            // case 'oldPassword':
            //     valid = // TODO: debounce, and check validity with backend request
            //     fieldsValidity.oldPassword = valid;
            //     fieldValidationErrors.oldPassword = valid ? '' : 'Incorrect';
            //     break;
            case 'newPassword':
                fieldsValidity.password = value.length == 0 || value.length >= this.minPwdLenth;
                fieldValidationErrors.password = fieldsValidity.password ? '': `Should contain at least ${this.minPwdLenth} characters`;
                // break omitted because in case of password change we want to compare them again
            case 'confirmPassword':
                fieldsValidity.confirmPassword = (value === this.state.newPassword);
                fieldValidationErrors.confirmPassword = fieldsValidity.confirmPassword ? '': 'The two passwords should be identical';
                break;
            default:
                break;
        }

        let formValid = true;
        for(let key in fieldsValidity) {
            formValid = formValid && fieldsValidity[key];
        }

        this.setState({
            formErrors: fieldValidationErrors,
            formValid,
            fieldsValidity
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({showErrors: true});

        if(!this.state.formValid) {
            this.setState({
                snackbarOpen: true,
                snackbarVariant: "error",
                snackbarMessage: "Incorrect data"
            });
            return false;
        }

        try {
            let user = this.props.user;
            let {username, email, surname, name, newPassword} = this.state;
            user.populate({username, email, surname, name, password: newPassword});
            await user.save()

            this.setState({
                snackbarOpen: true, 
                snackbarVariant: "success", 
                snackbarMessage: "Profile successfully updated",
                newPassword: "",
                confirmPassword: ""
            });
        }
        catch (error) {
            if (error.response) { // Server responded with status code out of range of 2xx
                console.log(error.response);
                this.setState({
                    snackbarOpen: true,
                    snackbarVariant: "error",
                    snackbarMessage: error.response.data.message
                });
            } else if (error.request) { // no response was received
                console.log(error.request);
            } else { // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        }        
    }

    closeSnackbar() {
        this.setState({snackbarOpen: false});
    };

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                    My profile
                </Typography>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        id="username"
                        label="Username"
                        name="username"
                        className={classes.textField}
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        margin="normal"
                        error={this.state.showErrors && !this.state.fieldsValidity.username}
                        helperText={this.state.showErrors ? this.state.formErrors.username : ""}
                    />

                    <TextField
                        id="email"
                        label="Email address"
                        name="email"
                        className={classes.textField}
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        margin="normal"
                        error={this.state.showErrors && !this.state.fieldsValidity.email}
                        helperText={this.state.showErrors ? this.state.formErrors.email : ""}
                    />

                    <TextField
                        id="name"
                        label="First name"
                        name="name"
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        margin="normal"
                        error={this.state.showErrors && !this.state.fieldsValidity.name}
                        helperText={this.state.showErrors ? this.state.formErrors.name : ""}
                    />

                    <TextField
                        id="surname"
                        label="Surname"
                        name="surname"
                        className={classes.textField}
                        value={this.state.surname}
                        onChange={this.handleInputChange}
                        margin="normal"
                        error={this.state.showErrors && !this.state.fieldsValidity.surname}
                        helperText={this.state.showErrors ? this.state.formErrors.surname : ""}
                    />

                    {/* <TextField
                        id="oldPassword"
                        label="Old password"
                        type="password"
                        name="oldPassword"
                        className={classes.textField}
                        value={this.state.oldPassword}
                        onChange={this.handleInputChange}
                        margin="normal"
                        error={!this.state.fieldsValidity.oldPassword}
                        helperText={this.state.formErrors.oldPassword}
                    />  */}

                    <TextField
                        id="newPassword"
                        label="New password"
                        type="password"
                        name="newPassword"
                        className={classes.textField}
                        value={this.state.newPassword}
                        onChange={this.handleInputChange}
                        margin="normal"
                        error={this.state.showErrors && !this.state.fieldsValidity.password}
                        helperText={this.state.showErrors ? this.state.formErrors.password : ""}
                        // disabled={this.state.oldPassword.length == 0 || !this.state.fieldsValidity.oldPassword}
                    />

                    <TextField
                        id="confirmPassword"
                        label="New password (confirm)"
                        type="password"
                        name="confirmPassword"
                        className={classes.textField}
                        value={this.state.confirmPassword}
                        onChange={this.handleInputChange}
                        margin="normal"
                        error={this.state.showErrors && !this.state.fieldsValidity.confirmPassword}
                        helperText={this.state.showErrors ? this.state.formErrors.confirmPassword : ""}
                        disabled={this.state.newPassword.length == 0}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.handleSubmit}
                        disabled={!this.state.formValid && this.state.showErrors}
                    >
                        Update profile
                    </Button>
                </form>

                <CustomizedSnackbar
                    onClose={this.closeSnackbar}
                    variant={this.state.snackbarVariant}
                    message={this.state.snackbarMessage}
                    open={this.state.snackbarOpen}
                />
            </Paper>
        );
    }
}

ProfileManagementLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileManagementLayout);
