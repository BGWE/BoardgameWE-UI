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
import PlaceIcon from "@material-ui/icons/Place";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import GameTable from "../Games/GameTable";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button/Button";
import moment from "moment-timezone";
import * as Helper from "../utils/Helper";

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
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
    },
    section_typography: {
        marginBottom: 10,
        marginTop: 10
    }
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
            let gcbgb_ranking = await this.props.eventModel.fetchRanking('gcbgb');
            let victory_ranking = await this.props.eventModel.fetchRanking('victory_count');
            let games = await this.props.eventModel.fetchLatestGames();

            this.setState({
                gcbgb_ranking: gcbgb_ranking,
                victory_ranking: victory_ranking,
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

        let ranking, ranking_name;
        if (this.state.gcbgb_ranking.length > 0) {
            ranking = this.state.gcbgb_ranking;
            ranking_name = "Great canadian blitz ranking";
        } else {
            ranking = this.state.victory_ranking;
            ranking_name = "Victories";
        }

        return (
            <div>
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            {this.props.eventModel.name}
                        </Typography>
                        <Typography variant="body1" align="center" color="textSecondary" paragraph>
                            <DateIcon/> From {Helper.formatDate(this.props.eventModel.start)} to {Helper.formatDate(this.props.eventModel.end)}.
                        </Typography>
                        <Typography variant="body1" align="center" color="textSecondary" paragraph>
                            <PlaceIcon/> {this.props.eventModel.location} {moment.locale()}
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" paragraph>
                            {this.props.eventModel.description}
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={16} justify="center">
                                <Grid item>
                                    <Link to={`${this.props.match.path}/games/add`} className={classes.button}>
                                        <Button variant="contained" color="primary">
                                            Add game
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
                <Grid container justify="center" spacing={24}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" align="left" className={classes.section_typography}>
                            Leaderboard
                        </Typography>

                        <RankingCard title={ranking_name} value={getRankingBest(ranking)}>
                            <RankingTable ranking={ranking} modifier={a => a}/>
                        </RankingCard>
                    </Grid>

                    <Grid item xs={12} md={8}>

                        <Typography variant="h4" align="left" className={classes.section_typography}>
                            Latest games
                        </Typography>

                        {
                            this.state.games.map((game) => {
                                game.players.sort(function (first, second) {
                                    return first.rank - second.rank;
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
        </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
