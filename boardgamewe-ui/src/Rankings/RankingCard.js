import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography,
} from "material-ui";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        width: '100%',
        alignItems: "center"
    },
    panel: {
      width: "100%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        // "justify-content": "center",

    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(26),
        color: theme.palette.text.primary,
        // "line-height": "px",

    },
    details: {
        alignItems: 'center',
    },
    leftColumn: {
        flexBasis: '40%',
    },
    rightColumn: {
        flexBasis: '45%',
    },
    panelSummary: {
        // justifyContent: 'center',
        // display: 'flex',
        // alignItems: 'center',
        // width: '..',
        // height: '..'
    }

});

class Rankings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    componentDidMount() {

    }


    render () {
        const { classes } = this.props;

        return (
            <ExpansionPanel className={classes.panel}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.panelSummary}>
                    <div className={classes.leftColumn}>
                        <h2 className={classes.heading} align="center">{this.props.title}</h2>
                    </div>
                    <div className={classes.rightColumn}>
                        <h2>{this.props.value}</h2>
                    </div>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails className={classes.details}>
                    {this.props.children}
                </ExpansionPanelDetails>

            </ExpansionPanel>
        );
    }
}

Rankings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rankings);
