import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    CircularProgress, Typography,
} from "material-ui";


const styles = theme => ({
    root: {
        width: '90%',
        marginRight: 'auto',
        marginLeft: 'auto'
    },

    gridList: {
        width: '80%',
        'padding-left': 0,
        'padding-right': 0,
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },

    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

class Rankings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: [],
        };

    }

    componentDidMount() {

    }


    render () {
        const { classes } = this.props;

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>

                <div style={{width: "100%"}}>
                    <h1>Rankings</h1>

                </div>
            </div>
        );
    }
}

Rankings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rankings);
