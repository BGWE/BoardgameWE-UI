import React from 'react';
import PropTypes from 'prop-types';

import RankingCard from "./RankingCard";
import RankingTable from "./RankingTable";

import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from '@material-ui/core/styles';
import {getRankingBest} from "../utils/Helper";
import Typography from "@material-ui/core/Typography/Typography";

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
            isLoading:true,

            is_mobile: window.innerWidth < Rankings.IS_MOBILE_THRESHOLD
        };

        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.reload = this.reload.bind(this);
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
            isLoading: true
        })
    }

    componentDidUpdate() {
        if (this.props.eventModel && this.state.isLoading) {
            this.reload();
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

        console.log(this.state);

        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            );
        }

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <Grid container justify="center" spacing={24}>
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h3"
                            align="center"
                        >
                            Rankings
                        </Typography>
                    </Grid>

                    <Grid item xs={12} container spacing={8} justify="center">
                        {rankings_info.map(info => (
                            <Grid
                                key={info.ranking_name}
                                item
                                className={this.state.is_mobile ? classes.grid_item_mobile : classes.grid_card}
                            >
                                <RankingCard
                                    is_mobile = {this.state.is_mobile}
                                    title = {info.title}
                                    value = {getRankingBest(this.state.rankings[info.ranking_name])}>
                                    {this.getRankingTableOrProgress(info.ranking_name, info.modifier, classes)}
                                </RankingCard>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Rankings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rankings);
