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
    }
});

class LoginLayout extends React.Component {

    constructor(props) {
        super(props);

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

            formErrors: {username:'', password: '', email: '', surnameValid: '', nameValid: ''},
            formValid: false

        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    switchView = () => {
        console.log("Switch view");
        this.setState({ signInView: !this.state.signInView }, this.validateForm);
    };

    handleSubmit = async (event) => {
        if (this.state.signInView) {
            // Login request
            try {
                let token = await UserModel.login(this.state.username, this.state.password); // TODO

                axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
                window.localStorage.accessToken = token;

                this.setState({ loginSuccessSnackbarOpen: true });

                setTimeout(() => this.props.callbackAuthentication(), 800);
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                    this.setState({ loginFailureSnackbarOpen: true, loginFailureSnackbarMsg: error.response.data.message });
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                    this.setState({ loginFailureSnackbarOpen: true, loginFailureSnackbarMsg: "No response received." });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    this.setState({ loginFailureSnackbarOpen: true });
                }
            }

        } else {
            // Register request
            try {
                let data = await UserModel.signUp(this.state.username, this.state.password, this.state.surname, this.state.name, this.state.email);
                console.log(data);

                this.setState({ registerSuccessSnackbarOpen: true });

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
                    this.setState({ registerFailureSnackbarOpen: true, registerFailureSnackbarMsg: error.response.data.error });
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            }
        }
        return false;
    };

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value},
            () => { this.validateField(name, value) });
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
        let surnameValid = this.state.surnameValid;
        let nameValid = this.state.nameValid;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': 'your password should contain at least 6 characters';
                break;
            case 'username':
                usernameValid = value.length > 0;
                fieldValidationErrors.username = usernameValid ? '': 'cannot be blank';
                break;
            case 'surname':
                surnameValid = value.length > 0;
                fieldValidationErrors.surname = surnameValid ? '': 'cannot be blank';
                break;
            case 'name':
                nameValid = value.length > 0;
                fieldValidationErrors.name = nameValid ? '': 'cannot be blank';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid,
            surnameValid: surnameValid,
            nameValid: nameValid,
            usernameValid: usernameValid
        }, this.validateForm);
    }

    validateForm() {
        if (!this.state.signInView) {
            this.setState({
                formValid: this.state.emailValid &&
                    this.state.passwordValid &&
                    this.state.usernameValid &&
                    this.state.nameValid &&
                    this.state.surnameValid
            });
        } else {
            this.setState({
                formValid: this.state.usernameValid &&
                    this.state.passwordValid
            });
        }
    }

    render() {
        const { classes } = this.props;

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
                        <InputLabel htmlFor="email">Username</InputLabel>
                        <Input
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={this.state.username}
                            onChange={this.handleInputChange}
                        />
                        <span className={classes.invalidInput}>{this.state.formErrors.username}</span>
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
                        />
                        <span className={classes.invalidInput}>{this.state.formErrors.password}</span>
                    </FormControl>

                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.handleSubmit}
                        disabled={!this.state.formValid}
                    >
                        Sign in
                    </Button>

                    <Button
                        // type="submit"
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
                        />
                        <span className={classes.invalidInput}>{this.state.formErrors.username}</span>
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
                        />
                        <span className={classes.invalidInput}>{this.state.formErrors.password}</span>
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
                        />
                        <span className={classes.invalidInput}>{this.state.formErrors.email}</span>
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="surname">Surname</InputLabel>
                        <Input
                            id="surname"
                            name="surname"
                            autoComplete="surname"
                            value={this.state.surname}
                            onChange={this.handleInputChange}
                        />
                        <span className={classes.invalidInput}>{this.state.formErrors.surname}</span>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                        />
                        <span className={classes.invalidInput}>{this.state.formErrors.name}</span>
                    </FormControl>

                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.handleSubmit}
                        disabled={!this.state.formValid}
                    >
                        Sign up
                    </Button>

                    <Button
                        // type="submit"
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