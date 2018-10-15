import React from 'react';
import PropTypes from 'prop-types';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RANK_COLORS from './RankingTable';
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Chip from "@material-ui/core/Chip/Chip";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import { withStyles } from '@material-ui/core/styles';


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
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.primary,
        // "line-height": "px",

    },

    details: {
        alignItems: 'center',
    },

    leftColumn: {
        flexBasis: '100%',
    },

    logoColumn: {
        padding: "auto"
    },

    chip: {
        marginTop: "12px",
        fontWeight: "bold"
    },

    avatarFirst: {
        backgroundColor: RANK_COLORS.gold
    },

    rightColumn: {
        marginLeft: "5px",
        flexBasis: '40%',
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
                    <div className={classes.leftColumn} align="left">
                        <h4>{this.props.title}</h4>
                    </div>
                    <div className={classes.rightColumn} align="right">
                        <Chip
                            className={classes.chip}
                            avatar={<Avatar style={{backgroundColor: "#FFD700"}}>1<sup>st</sup></Avatar>}
                            label={this.props.value}/>
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
