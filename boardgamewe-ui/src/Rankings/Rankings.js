import React from 'react';
import PropTypes from 'prop-types';

import RankingCard from "./RankingCard";
import RankingTable from "./RankingTable";

import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        width: '100%',
    },
    grid_item_mobile: {
        width: '100%',
        marginLeft: '0px',
        marginRight: '0px',
    },
    grid_card: {
        width: "40%",
        minWidth: "350px",
    }
});

class Rankings extends React.Component {
    static IS_MOBILE_THRESHOLD = 800;

    constructor(props) {
        super(props);

        this.state = {
            spacing: '40',
            rankings: null,

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
        this.setState({
            isLoading:true
        })
    }

    componentDidUpdate() {
        if (this.props.eventModel && this.state.isLoading) {
            this.reload();
        }
    }

    getFirstName(player) {
        let firstname;
        if (player.name) {
            firstname = player.name.split(" ")[0];
        } else {
            firstname = player.user.name;
        }
        return firstname;
    }

    getRankingBest (ranking_name, modifier) {
        if (!this.state.rankings || !this.state.rankings[ranking_name] || this.state.rankings[ranking_name].length === 0) {
            return "/";
        }

        const players = this.state.rankings[ranking_name];
        if (players.length > 2 && players.slice(0, 3).every(a => a.win)) {
            return this.getFirstName(players[0].player) + ", " + this.getFirstName(players[1].player) + ",...";
        }  else if (players.length >= 2 && players.slice(0, 2).every(a => a.win)) {
            return this.getFirstName(players[0].player) + " & " + this.getFirstName(players[1].player);
        } if (players.length > 0) {
            return this.getFirstName(players[0].player);
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

    async reload() {

        try {
            let data = await this.props.eventModel.fetchRankings();

            this.setState({
                rankings: data,
                isLoading: false
            });
        } catch (e) {
            console.log(e);
            this.setState({
                snackbar_error: true,
                isLoading: false
            });
        }
    }

    render () {
        const { classes } = this.props;

        const rankings_info = [
            { ranking_name: "victory_count", title: "Games won", modifier: a => a },
            { ranking_name: "victory_prop", title: "Games won (%)", modifier: a => Math.round(a * 100) + "%"},
            { ranking_name: "count_games", title: "Games played", modifier: a => a },
            { ranking_name: "count_unique_games", title: "Different games played", modifier: a => a },
            { ranking_name: "defeat_count", title: "Games lost", modifier: a => a },
            { ranking_name: "defeat_prop", title: "Games lost (%)", modifier: a => Math.round(a * 100) + "%"},
            { ranking_name: "is_last", title: "Games as last", modifier: a => a },
            { ranking_name: "is_last_prop", title: "Games as last (%)", modifier: a => Math.round(a * 100) + "%"},
            { ranking_name: "gcbgb", title: "Great canadian blitz ranking", modifier: a => a},
        ];

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <div style={{width: "100%"}}>
                    <h1>Rankings</h1>

                    <Grid container className={classes.root} spacing={8} justify={"center"}>
                        {rankings_info.map(info => (
                            <Grid
                                key={info.ranking_name}
                                item
                                className={this.state.is_mobile ? classes.grid_item_mobile : classes.grid_card}
                            >
                                <RankingCard
                                    is_mobile = {this.state.is_mobile}
                                    title={info.title}
                                    value={this.getRankingBest(info.ranking_name, info.modifier)}>
                                    {this.getRankingTableOrProgress(info.ranking_name, info.modifier, classes)}
                                </RankingCard>
                            </Grid>
                        ))}
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
