import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Typography from "@material-ui/core/Typography/Typography";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import {convertToISO, getRankingBest, ISODateToNormalDate} from "../utils/Helper";
import RankingTable from "../Rankings/RankingTable";
import RankingCard from "../Rankings/RankingCard";
import DateIcon from "@material-ui/icons/DateRange";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import GameTable from "../Games/GameTable";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";

const styles = theme => ({
    root: {
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },

    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        flexBasis: '33.33%'
    },
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ranking: [],
            games: [],
            isLoading: true
        };

        this.reload = this.reload.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })
    }

    componentDidUpdate() {
        if (this.props.eventModel && this.state.isLoading) {
            this.reload();
        }
    }

    async reload() {
        try {
            let ranking = await this.props.eventModel.fetchRanking('victory_count');
            let games = await this.props.eventModel.fetchLatestGames();

            this.setState({
                ranking: ranking,
                games: games,
                isLoading: false});
        } catch (e) {
            console.log(e);

            this.setState({
                snackbar_error: true,
                isLoading: false
            });
        }
    }

    render () {
        const {classes} = this.props;

        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7}/>
                </div>
            )
        }

        console.log(this.props.eventModel);


        const {creator, start, end} = this.props.eventModel;

        return (
            <Grid
                container
                justify="center"
                spacing={24}
            >
                <Grid item xs={12} md={8}>
                    <Typography
                        component="h4"
                        variant="h4"
                        align="left"
                    >
                        Welcome to {this.props.eventModel.name} !
                    </Typography>
                    <div align="left" style={{marginBottom: 10}}>
                        <DateIcon/> {ISODateToNormalDate(start)} to {ISODateToNormalDate(end)}
                    </div>
                    <Typography align="left" variant="body1">
                        Hosted by {creator.name + " " + creator.surname}, in {this.props.eventModel.location}.
                        The {this.props.eventModel.attendees.length} participants are bringing {this.props.eventModel.provided_board_games.length} board games with them.
                        Prepare your dices, fetch your beer, this weekend is going down in History !
                    </Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Typography
                        variant="h4"
                        align="left"
                    >
                        Leaderboard
                    </Typography>

                    <Typography align="left" variant="body1">
                        {getRankingBest(this.state.ranking)} is in the lead ! Time to whoop his/her sorry ass !
                    </Typography>

                    <RankingCard
                        title = "Victories"
                        value = {getRankingBest(this.state.ranking)}
                    >
                        <RankingTable
                            ranking={this.state.ranking}
                            modifier={a => a}
                        />
                    </RankingCard>
                </Grid>

                <Grid item xs={12} md={8}>

                    <Typography
                        variant="h4"
                        align="left"
                    >
                        Latest games
                    </Typography>

                    {
                        this.state.games.map((game) => {
                            game.players.sort(function (first, second) {
                                if (first.rank === second.rank) {
                                    return 0;
                                }
                                else if (first.rank < second.rank) {
                                    return -1;
                                }
                                else {
                                    return 1;
                                }
                            });

                            game.players[0].winner = true;

                            let created_at = new Date(game.createdAt);
                            return (
                                <ExpansionPanel key={game.id} >
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography className={classes.heading}>{game.board_game.name}</Typography>
                                        <Typography className={classes.secondaryHeading}>{created_at.toLocaleString("fr-BE")}</Typography>
                                        {
                                            game.duration ? <Typography className={classes.secondaryHeading}> Lasted {game.duration ? game.duration : ""} minutes </Typography> : ""
                                        }
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails style={{width: "80%", alignItems: 'center'}}>
                                        <GameTable
                                            game={game}
                                            modifier={a => a}
                                            isWinLose={game.hasOwnProperty('ranking_method') && game.ranking_method === "WIN_LOSE"}
                                        />
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                );
                            })
                        }
                    </Grid>
            </Grid>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
