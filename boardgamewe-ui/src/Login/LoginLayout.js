import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import UserModel from "../utils/api/User";
import axios from "axios";
import CustomizedSnackbar from "../utils/UI/Snackbar";

import green from '@material-ui/core/colors/green';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const styles = theme => ({
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
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    registerText: {
        marginTop: theme.spacing.unit * 3,
    },
    invalidInput: {
        color: 'red'
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -12,
    }
});

class LoginLayout extends React.Component {

    constructor(props) {
        super(props);

        this.minPwdLenth = 7;

        this.state = {
            signInView: true,

            loginSuccessSnackbarOpen: false,
            loginFailureSnackbarOpen: false,
            loginFailureSnackbarMsg: "",

            registerSuccessSnackbarOpen: false,
            registerFailureSnackbarOpen: false,
            registerFailureSnackbarMsg: "",

            username: "",
            password: "",
            email: "",
            surname: "",
            name: "",

            usernameValid: false,
            passwordValid: false,
            emailValid: false,
            surnameValid: false,
            nameValid: false,
            formValid: false,
            formErrors: {password: '', email: ''},
            showErrors:false,

            loading: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    switchView = () => {
        console.log("Switch view");
        this.setState({
            signInView: !this.state.signInView,
            showErrors: false
        });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            loading: true
        });

        if (this.state.signInView) {
            // Login request
            try {
                let token = await UserModel.login(this.state.username, this.state.password);

                axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
                window.localStorage.accessToken = token;

                this.setState({
                    loginSuccessSnackbarOpen: true,
                });

                setTimeout(() => this.props.callbackAuthentication(), 800);
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                    this.setState({
                        loginFailureSnackbarOpen: true,
                        loginFailureSnackbarMsg: error.response.data.message,
                        loading: false,
                        showErrors: true
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                    this.setState({
                        loginFailureSnackbarOpen: true,
                        loginFailureSnackbarMsg: "No response received.",
                        loading: false
                    });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    this.setState({
                        loginFailureSnackbarOpen: true,
                        loading: false
                    });
                }
            }

        } else  if (this.state.formValid) {
            // Register request - only called if the form is valid
            try {
                let data = await UserModel.signUp(this.state.username, this.state.password, this.state.surname, this.state.name, this.state.email);
                console.log(data);

                this.setState({
                    registerSuccessSnackbarOpen: true,
                });

                setTimeout(() => window.location.reload(), 800);
            }
            catch (error) {
                if (error.response) {
                    console.log(error.response);
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                    this.setState({
                        registerFailureSnackbarOpen: true,
                        registerFailureSnackbarMsg: error.response.data.error,
                        loading: false
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);

                    this.setState({
                        loading: false
                    });

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    this.setState({
                        loading:false
                    })
                }
            }
        } else {
            // Registration form is invalid -> show it to the user.
            this.setState({
                showErrors: true,
                loading: false
            })
        }
        return false;
    };

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({[name]: value});

        if (!this.state.signInView) {
            this.validateField(name, value);
        } else if (this.state.showErrors) {
            this.setState({
                showErrors: false
            })
        }
    }

    handleCloseSnackbar = () => {
        this.setState({
            loginSuccessSnackbarOpen: false,
            loginFailureSnackbarOpen: false,

            registerSuccessSnackbarOpen: false,
            registerFailureSnackbarOpen: false,
        });

        // Well... This is ugly and inefficient...
        // Problem is if we put the same in setState above, we can see in the UI that the text is disappearing,
        // before the snackbar is completely gone. We can see the text changing as the snackbar fades away.
        // So temporary workaround til a better solution comes...
        setTimeout(() => this.setState({
            loginFailureSnackbarMsg: "",
            registerFailureSnackbarMsg: ""
        }), 800);

    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let usernameValid = this.state.usernameValid;
        let nameValid = this.state.nameValid;
        let surnameValid = this.state.surnameValid;


        switch(fieldName) {
            case 'name':
                nameValid = value.length > 0;
                break;
            case 'surname':
                surnameValid = value.length > 0;
                break;
            case 'username':
                usernameValid = value.length > 0;
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'is invalid';
                break;
            case 'password':
                passwordValid = value.length >= this.minPwdLenth;
                fieldValidationErrors.password = passwordValid ? '': 'your password should contain at least ' + this.minPwdLenth +  ' characters';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            usernameValid: usernameValid,
            emailValid: emailValid,
            nameValid: nameValid,
            surnameValid: surnameValid,
            passwordValid: passwordValid
        }, this.validateRegistrationForm);
    }

    validateRegistrationForm() {
        let valid = this.state.usernameValid &&
            this.state.emailValid &&
            this.state.passwordValid &&
            this.state.nameValid &&
            this.state.surnameValid;

        this.setState({
            formValid: valid
        });
    }

    render() {
        const { classes } = this.props;
        const { loading } = this.state;

        let signIn = (
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockIcon />
                </Avatar>
                <Typography variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={this.state.username}
                            onChange={this.handleInputChange}
                            error={this.state.showErrors}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            error={this.state.showErrors}
                        />
                    </FormControl>

                    <div className={classes.wrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className={classes.submit}
                            onClick={this.handleSubmit}
                        >
                            Sign in
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>

                    <Button
                        type="submit"
                        color="default"
                        className={classes.submit}
                        size={"small"}
                        variant="text"
                        onClick={this.switchView}
                    >
                        Click here to register
                    </Button>

                </form>
            </Paper>
        );


        let signUp = (
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input
                            id="username"
                            name="username"
                            autoComplete="username"
                            value={this.state.username}
                            onChange={this.handleInputChange}
                            error={this.state.showErrors && !this.state.usernameValid}
                        />
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            error={this.state.showErrors && !this.state.passwordValid}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            error={this.state.showErrors && !this.state.emailValid}
                        />
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="surname">Surname</InputLabel>
                        <Input
                            id="surname"
                            name="surname"
                            autoComplete="surname"
                            value={this.state.surname}
                            onChange={this.handleInputChange}
                            error={this.state.showErrors && !this.state.surnameValid}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                            error={this.state.showErrors && !this.state.nameValid}
                        />
                    </FormControl>

                    <div className={classes.wrapper}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className={classes.submit}
                            onClick={this.handleSubmit}
                        >
                            Sign up
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>

                    <Button
                        color="default"
                        className={classes.submit}
                        size={"small"}
                        variant="text"
                        onClick={this.switchView}
                    >
                        Back to login
                    </Button>
                </form>
            </Paper>
        );

        let loginSuccessSnackbar = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="success"
                message="Login successful!"
                open={this.state.loginSuccessSnackbarOpen}
            />
        );

        let loginFailureMsg = "";
        if (this.state.loginFailureSnackbarMsg) {
            loginFailureMsg = "Failed to log in: " + this.state.loginFailureSnackbarMsg;
        } else {
            loginFailureMsg = "Failed to log in."
        }

        let loginFailedSnackbar = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="error"
                message={loginFailureMsg}
                open={this.state.loginFailureSnackbarOpen}
            />
        );

        let registerSuccessSnackbar = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="success"
                message="Registration successful!"
                open={this.state.registerSuccessSnackbarOpen}
            />
        );

        let registerFailureMsg = "";
        if (this.state.registerFailureSnackbarMsg) {
            registerFailureMsg = "Failed to register: " + this.state.registerFailureSnackbarMsg;
        } else {
            registerFailureMsg = "Failed to register."
        }

        let registerFailedSnackbar = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="error"
                message={registerFailureMsg}
                open={this.state.registerFailureSnackbarOpen}
            />
        );

        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    {this.state.signInView ? signIn : signUp}
                    {loginSuccessSnackbar}
                    {loginFailedSnackbar}
                    {registerSuccessSnackbar}
                    {registerFailedSnackbar}
                </main>
            </React.Fragment>
        );
    }
}

LoginLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginLayout);
