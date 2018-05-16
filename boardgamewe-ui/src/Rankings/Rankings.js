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
import RankingTable from "./RankingTable";


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
            rankings: null,
            isLoading: true
        };

    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.reload();
    }

    getRankingBest (ranking_name) {
        if (!this.state.rankings || this.state.rankings[ranking_name].length === 0) {
            return "/";
        }

        const best = this.state.rankings[ranking_name][0];
        return best.player.name + " - " + best.score;
    }

    getRankingTableOrProgress (ranking_name, classes) {
        if (!this.state.rankings) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            );
        }

        return (
            <RankingTable ranking={this.state.rankings[ranking_name]}>
            </RankingTable>
        );
    }

    reload() {
        fetch('http://api.boardgameweekend.party/stats/rankings/')
            .then(response => response.json())
            .then(function (data) {
                console.log("request");
                console.log(data);
                this.setState({ rankings: data, isLoading: false })
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({ snackbar_error: true, isLoading: false })
            });
    }

    render () {
        const { classes } = this.props;
        const { spacing } = this.state;

        console.log(this.state);

        const rankings_info = [
            { ranking_name: "victory_count", title: "Number of games won" },
            { ranking_name: "defeat_count", title: "Number of games lost" },
            { ranking_name: "victory_prop", title: "Percentage of games won" },
            { ranking_name: "defeat_prop", title: "Percentage of games lost" },
            { ranking_name: "count_games", title: "Number of games played" },
            { ranking_name: "count_unique_games", title: "Number of different games played" }
        ];

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>

                <div style={{width: "100%"}}>
                    <h1>Rankings</h1>

                    <Grid container className={classes.root} spacing={16}>
                        <Grid item xs>
                            <Grid container className={classes.demo} justify="center" spacing={Number(spacing)}>
                                {rankings_info.map(info => (
                                    <Grid key={info.ranking_name} item className={classes.grid_card}>
                                        <RankingCard
                                            title={info.title}
                                            value={this.getRankingBest(info.ranking_name)}>
                                            {this.getRankingTableOrProgress(info.ranking_name, classes)}
                                        </RankingCard>
                                    </Grid>
                                ))}
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
