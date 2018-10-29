import React from "react";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Typography from "@material-ui/core/Typography/Typography";

const styles = theme => ({

});

class ErrorPageLayout extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <React.Fragment>
                    <CssBaseline />
                    <div>
                        <Typography variant="h5" gutterBottom>
                            The appplication is currently not accessible.
                        </Typography>
                    </div>

                </React.Fragment>
            </div>
        )
    }
}

ErrorPageLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorPageLayout);