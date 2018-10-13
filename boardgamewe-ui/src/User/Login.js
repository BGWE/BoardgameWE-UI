import React from 'react';
import Button from 'material-ui/Button';
import axios from "axios";
import User from "../utils/api/User.js";

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        // TODO
    }

    async login() {
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
