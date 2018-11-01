import React from 'react';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import moment from "moment-timezone";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Button from "@material-ui/core/Button/Button";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";

import ConfirmDeleteDialog from "../Boardgames/Dialog/ConfirmDeleteDialog";
import GameTable from "./GameTable";
import * as Helper from "../utils/Helper";
import {compareGamesByCreation} from "../utils/api/Game";

const styles = theme => ({
    root: {
        width: '70%',
        marginRight: 'auto',
        marginLeft: 'auto'
    },

    mobileRoot: {
        width: '100%',
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
        flexBasis: '33.33%'
    },

    tableWrapper: {
        overflowX: 'auto',
    }
});

class Games extends React.Component {

    static IS_MOBILE_THRESHOLD = 800;

    constructor(props) {
        super(props);

        this.state = {
            games: [],
            n_cols: 4,
            snackbar_error: false,
            open_modal: false,
            confirm_delete_open: false,
            game_to_delete: null,

            is_mobile: window.innerWidth < Games.IS_MOBILE_THRESHOLD
        };

        // Bind this
        this.reload = this.reload.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleCloseSnack = this.handleCloseSnack.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
        this.handleDeleteGame = this.handleDeleteGame.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ is_mobile: window.innerWidth < Games.IS_MOBILE_THRESHOLD })

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

    async reload() {
        try {
            let games = await this.props.eventModel.fetchGames();
            games = games.sort(compareGamesByCreation);


            this.setState({
                games: games,
                isLoading: false,
                confirm_delete_open: false,
                game_to_delete: null});

        } catch (e) {
            console.log(e);
            this.setState({
                games: [],
                isLoading: false,
                snackbar_error: true,
                confirm_delete_open: false,
                game_to_delete: null});
        }
    }

    handleClickAdd() {
        console.log('Opening modal');
        this.setState({open_modal: true});
    }

    handleCloseModal() {
        console.log('Closing modal');
        this.setState({open_modal: false});
    }

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbar_error: false})
    }

    async handleDeleteGame() {
        try {
            await this.state.game_to_delete.delete();
        } catch (e) {
            console.log(e);
        }
        finally {
            this.setState({
                isLoading:true
            });
        }
    }

    render () {
        const { classes } = this.props;

        if (this.state.isLoading) {
            return (
                <div className={this.state.is_mobile ? classes.mobileRoot : classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }

        return (
            <div className={this.state.is_mobile ? classes.mobileRoot : classes.root} style={{backgroundColor: '#fafafa'}}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.snackbar_error}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">Error while fetching the games </span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnack}>
                            <CloseIcon/>
                        </IconButton>
                    ]}>

                </Snackbar>

                <ConfirmDeleteDialog
                    isOpen={this.state.confirm_delete_open}
                    fnCancel={() => this.setState({game_to_delete: null, confirm_delete_open: false})}
                    fnConfirm={this.handleDeleteGame}
                    fnOnClose={() => this.setState({game_to_delete: null, confirm_delete_open: false})}
                />

                <Grid
                    container
                    justify="center"
                    spacing={24}
                    >
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h3"
                            align="center"
                        >
                            Games
                        </Typography>
                        <Typography>
                            {this.state.games.length} games(s) played so far.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Tooltip id="tooltip-fab" title="Add" placement="right">
                            <Link to={`${this.props.match.url}/games/add`}>
                                <Button variant="fab" color="secondary" aria-label="add">
                                    <AddIcon />
                                </Button>
                            </Link>
                        </Tooltip>
                    </Grid>


                    <Grid item xs={12} md={8}>
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

                                return (
                                    <ExpansionPanel key={game.id} >
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}> {game.board_game.name} </Typography>
                                            <Typography className={classes.secondaryHeading}> {Helper.formatDatetime(game.createdAt)} </Typography>
                                            {
                                                game.duration ? <Typography className={classes.secondaryHeading}> Lasted {game.duration ? game.duration : ""} minutes </Typography> : ""
                                            }

                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{justifyItems: 'center'}}>
                                            <GameTable
                                                game={game}
                                                modifier={a => a}
                                                isWinLose={game.hasOwnProperty('ranking_method') && game.ranking_method === "WIN_LOSE"}
                                            />
                                        </ExpansionPanelDetails>
                                        <Divider />
                                        <ExpansionPanelActions>
                                            <IconButton
                                                key="close"
                                                aria-label="Close"
                                                color="inherit"
                                                onClick={() => this.setState({confirm_delete_open: true, game_to_delete: game})}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ExpansionPanelActions>
                                    </ExpansionPanel>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Games.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Games);
