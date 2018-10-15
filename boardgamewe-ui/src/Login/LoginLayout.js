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
    }
});

class LoginLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            signInView: true,

            username: "",
            password: "",
            email: "",
            surname: "",
            name: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    switchView = () => {
        console.log("Switch view");
        this.setState({ signInView: !this.state.signInView });
    };

    handleSubmit = async (event) => {
        console.log("SUBMIT");
        //Make a network call somewhere
        if (this.state.signInView) {
            // Login request
            let token = await UserModel.login(this.state.username, this.state.password); // TODO
            axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
            window.localStorage.accessToken = token;
            // this.props.callbackAuthentication();
        } else {
            // Register request
            let data = await UserModel.signUp(this.state.username, this.state.password, this.state.surname, this.state.name, this.state.email)
            console.log(data);
        }
        return false;
    };

    handleInputChange(event) {
        console.log("Input change");
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
        console.log(this.state);
    }

    render() {
        const { classes } = this.props;

        let signIn = (
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
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
                            onChange={this.handleInputChange} />
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
                    </FormControl>

                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.handleSubmit}
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
                            onChange={this.handleInputChange}/>
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
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={this.state.email}
                            onChange={this.handleInputChange}/>
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="surname">Surname</InputLabel>
                        <Input
                            id="surname"
                            name="surname"
                            autoComplete="surname"
                            value={this.state.surname}
                            onChange={this.handleInputChange}/>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}/>
                    </FormControl>

                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.handleSubmit}
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

        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    {this.state.signInView ? signIn : signUp}
                </main>
            </React.Fragment>
        );
    }
}

LoginLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginLayout);