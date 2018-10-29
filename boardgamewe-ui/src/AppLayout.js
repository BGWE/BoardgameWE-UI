import React from "react";
import {Redirect} from "react-router-dom";
import Event from "./utils/api/Event";
import axios from "axios";
import * as Helper from "./utils/Helper";
import {CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";

class AppLayout extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            ongoingEvent: null,
            waiting: false
        }

    }

    componentWillMount() {
        this.setState({
            waiting: true
        });
    }

    componentDidMount() {
        let token = window.localStorage.accessToken;

        if(token === null) {
            return
        }

        axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
        let decoded_token = Helper.getTokenPayload(token);
        let ongoing = true;
        let user_id = [decoded_token.id];

        Event.fetchAll(ongoing, user_id)
            .then((events) => {
                console.log(events);

                if (events.length === 1) {
                    console.log("Setting state: confirmed");
                    this.gettingEvents = false;
                    this.setState({
                        ongoingEvent: events[0]
                    });
                }

                console.log("Setting waiting state to false");
                this.setState({
                    waiting: false
                });
            });


    }

    componentWillUnmount() {
        this.gettingEvents = false;
    }

    static eventsURL() {
        return '/events'
    }

    static eventURL(event) {
        return `/event/${event.id}`
    }

    loadingApp() {
        return (
            <div>
                <Typography variant="h5" gutterBottom>
                    Loading the application...
                </Typography>
                <CircularProgress thickness={7} />
            </div>

        )
    }

    render() {
        console.log("render");

        if (this.state.waiting) {
            return this.loadingApp()
        }

        console.log(this.state);
        return <Redirect to={this.state.ongoingEvent === null ? AppLayout.eventsURL() : AppLayout.eventURL(this.state.ongoingEvent)}/>
    }
}

export default AppLayout;