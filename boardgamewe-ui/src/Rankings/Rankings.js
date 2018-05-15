import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    Button,
    Chip,
    CircularProgress, Divider,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    Paper,
    Typography,
} from "material-ui";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import RankingCard from "./RankingCard";


// const styles = theme => ({
//     root: {
//         flexGrow: 1,
//     },
//     paper: {
//         height: 140,
//         width: 140,
//     },
//     control: {
//         padding: theme.spacing.unit * 2,
//     },
// });

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        "justify-content": "center",

    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(26),
        color: theme.palette.text.primary,
        "line-height": "px",

    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    grid_card: {
        width: "40%",
        minWidth: "300px",
        maxWidth: "600px"
    }
});

class Rankings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spacing: '40',

        };

    }

    componentDidMount() {

    }


    render () {
        const { classes } = this.props;
        const { spacing } = this.state;

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>

                <div style={{width: "100%"}}>
                    <h1>Rankings</h1>

                    <Grid container className={classes.root} spacing={16}>
                        <Grid item xs>
                            <Grid container className={classes.demo} justify="center" spacing={Number(spacing)}>

                                <Grid key="n_games_played" item className={classes.grid_card}>
                                    <RankingCard
                                        title="Number of games played"
                                        value="30">
                                        DETAILS
                                    </RankingCard>
                                </Grid>

                                <Grid key="n_games_won" item className={classes.grid_card}>
                                    <RankingCard
                                        title="Number of games won"
                                        value="30">
                                        DETAILS
                                    </RankingCard>
                                </Grid>

                                <Grid key="n_games_lost" item className={classes.grid_card}>
                                    <RankingCard
                                        title="Number of games lost"
                                        value="30">
                                        DETAILS
                                    </RankingCard>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

Rankings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rankings);
