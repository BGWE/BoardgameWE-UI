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
        minWidth: "330px",
        // maxWidth: "600px"
    }
});

class Rankings extends React.Component {
    static IS_MOBILE_THRESHOLD = 800;

    constructor(props) {
        super(props);

        this.state = {
            spacing: '40',
            rankings: null,
            isLoading: true,

            is_mobile: window.innerWidth < Rankings.IS_MOBILE_THRESHOLD
        };

        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        console.log(window.innerWidth);
        this.setState({ is_mobile: window.innerWidth < Rankings.IS_MOBILE_THRESHOLD })

    };

    componentDidMount() {
        this.setState({ isLoading: true });
        this.reload();
    }

    getFirstName(player) {
        return player.player.name.split(" ")[0];
    }

    getRankingBest (ranking_name, modifier) {
        if (!this.state.rankings || this.state.rankings[ranking_name].length === 0) {
            return "/";
        }

        const players = this.state.rankings[ranking_name];
        if (players.length > 2 && players.slice(0, 3).every(a => a.win)) {
            return this.getFirstName(players[0]) + ", " + this.getFirstName(players[1]) + ",...";
        }  else if (players.length >= 2 && players.slice(0, 2).every(a => a.win)) {
            return this.getFirstName(players[0]) + " & " + this.getFirstName(players[1]);
        } if (players.length > 0) {
            return this.getFirstName(players[0]);
        } else {
            return "";
        }
    }

    getRankingTableOrProgress (ranking_name, modifier, classes) {
        if (!this.state.rankings) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            );
        }

        return (
            <RankingTable
                ranking={this.state.rankings[ranking_name]}
                modifier={modifier}>
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
            { ranking_name: "victory_count", title: "Games won", modifier: a => a },
            { ranking_name: "defeat_count", title: "Games lost", modifier: a => a },
            { ranking_name: "victory_prop", title: "Games won (%)", modifier: a => Math.round(a * 100) + "%"},
            { ranking_name: "defeat_prop", title: "Games lost (%)", modifier: a => Math.round(a * 100) + "%"},
            { ranking_name: "count_games", title: "Games played", modifier: a => a },
            { ranking_name: "count_unique_games", title: "Different games played", modifier: a => a }
        ];

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>

                <div style={{width: "100%"}}>
                    <h1>Rankings</h1>

                    <Grid container className={classes.root} spacing={16}>
                        <Grid item xs>
                            <Grid container justify="center" spacing={Number(spacing)}>
                                {rankings_info.map(info => (
                                    <Grid key={info.ranking_name} item className={classes.grid_card}>
                                        <RankingCard
                                            title={info.title}
                                            value={this.getRankingBest(info.ranking_name, info.modifier)}>
                                            {this.getRankingTableOrProgress(info.ranking_name, info.modifier, classes)}
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
