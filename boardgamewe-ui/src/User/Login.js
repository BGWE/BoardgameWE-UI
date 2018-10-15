import React from 'react';
import axios from "axios";
import User from "../utils/api/User.js";
import Button from "@material-ui/core/Button";

export default class Login extends React.Component {
    async login() {
        console.log("Login");
        try {
            let token = await User.login("", ""); // TODO
            axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
            window.localStorage.accessToken = token;
            this.props.callbackAuthentication();
        }
        catch(error) {
            // TODO: error message
        }
    }

    render() { // TODO
        return (
            <div>
                <Button onClick={() => this.login()}>Test</Button>
            </div>
        );
    }
}
