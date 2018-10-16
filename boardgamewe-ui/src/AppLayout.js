import React from "react";
import {Redirect} from "react-router-dom";

class AppLayout extends React.Component{
    render() {
        return <Redirect to="/events"/>
    }
}

export default AppLayout;