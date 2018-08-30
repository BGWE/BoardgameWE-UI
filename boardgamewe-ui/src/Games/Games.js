import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    GridList,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Snackbar,
    TextField,
    Tooltip,

    Typography
} from "material-ui";

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from "react-router-dom/es/Link";

import RankingTable from "../Rankings/RankingTable";
import ConfirmDeleteDialog from "../Boardgames/Dialog/ConfirmDeleteDialog";

import { Constants } from "../utils/Constants";

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
    },

    tableWrapper: {
        overflowX: 'auto',
    }
});

class Games extends React.Component {

        static IS_MOBILE_THRESHOLD = 800;

        constructor(props) {
            super(props);

            console.log(window.innerWidth < Games.IS_MOBILE_THRESHOLD);

            this.state = {
                games: [],
                n_cols: 4,
                isLoading: true,
                snackbar_error: false,
                open_modal: false,
                confirm_delete_open: false,
                game_to_delete: null,

                is_mobile: window.innerWidth < Games.IS_MOBILE_THRESHOLD
            };

            this.spacing = 10;

            // Bind this
            this.reload = this.reload.bind(this);
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
            console.log(window.innerWidth);
            this.setState({ is_mobile: window.innerWidth < Games.IS_MOBILE_THRESHOLD })

        };

        componentDidMount() {
            this.reload()
        }

        reload() {
            this.setState({ isLoading: true });

            fetch(Constants.API_ADDRESS + '/games')
                .then(response => {
                    if (!response.ok) throw Error('Request failed');
                    return response.json();
                })
                .then(function(data) {
                    console.log(data);

                    this.setState({ games: data, isLoading: false, confirm_delete_open: false, game_to_delete: null });
                }.bind(this))
                .catch(error => {
                    console.log(error);
                    this.setState({ games: [], isLoading: false, snackbar_error: true, confirm_delete_open: false, game_to_delete: null });
                })
        }

        // handleExpandClick = (_id) => {
        //     let mod_state = this.state;
        //
        //     mod_state.games = mod_state.games.map((game) => {
        //         if (game.id === _id) {
        //             let mod_game = game;
        //             mod_game.expanded = !game.expanded;
        //             return mod_game;
        //         }
        //         return game;
        //     });
        //
        //     this.setState(mod_state);
        // };

        handleClickAdd() {
            console.log('Opening modal');
            this.setState({ open_modal: true });
        }

        handleCloseModal() {
            console.log('Closing modal');
            this.setState({ open_modal: false });
        }

        handleCloseSnack(event, reason) {
            if (reason === 'clickaway') {
                return;
            }

            this.setState({ snackbar_error: false })
        }

        handleDeleteGame() {
            let url = new URL(Constants.API_ADDRESS + '/game/' + this.state.game_to_delete);

            fetch(url, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) throw Error('Request failed');
                    return response.json();
                })
                .then(function(data) {
                    console.log(data);
                    this.reload();
                }.bind(this))
                .catch(error => {
                    console.log(error);
                })
        }

        sortByProp(data, prop) {
            return new Map([...data.entries()].sort((a, b) => a[1][prop] > b[1][prop]));
        };

        render() {
            const { classes } = this.props;
            const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

            if (this.state.isLoading) {
                return ( <
                    div className = { this.state.is_mobile ? classes.mobileRoot : classes.root } >
                    <
                    CircularProgress thickness = { 7 }
                    /> <
                    /div>
                )
            }

            // if (this.state.games.length)

            return ( <
                div className = { this.state.is_mobile ? classes.mobileRoot : classes.root }
                style = {
                    { backgroundColor: '#fafafa' } } >
                <
                Snackbar anchorOrigin = {
                    {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                }
                open = { this.state.snackbar_error }
                autoHideDuration = { 3000 }
                onClose = { this.handleCloseSnack }
                ContentProps = {
                    {
                        'aria-describedby': "error_msg"
                    }
                }
                message = { < span id = "error_msg" > Error
                    while fetching the games < /span>}
                    action = {
                        [ <
                            IconButton
                            key = "close"
                            aria - label = "Close"
                            color = "inherit"
                            onClick = { this.handleCloseSnack } >
                            <
                            CloseIcon / >
                            <
                            /IconButton>
                        ]
                    } >

                    <
                    /Snackbar>

                    <
                    ConfirmDeleteDialog
                    isOpen = { this.state.confirm_delete_open }
                    fnCancel = {
                        () => this.setState({ game_to_delete: null, confirm_delete_open: false }) }
                    fnConfirm = { this.handleDeleteGame }
                    fnOnClose = {
                        () => this.setState({ game_to_delete: null, confirm_delete_open: false }) }
                    />

                    <
                    div style = {
                        { width: "100%" } } >
                    <
                    h1 > Games < /h1> <
                    p > { this.state.games.length }
                    game(s) played so far. < /p> <
                    /div> <
                    div style = {
                        { paddingBottom: 20 } } >
                    <
                    Tooltip id = "tooltip-fab"
                    title = "Add"
                    placement = "right" >
                    <
                    Link to = "/games/add" >
                    <
                    Button variant = "fab"
                    color = "secondary"
                    aria - label = "add" >
                    <
                    AddIcon / >
                    <
                    /Button> <
                    /Link> <
                    /Tooltip> <
                    /div>

                    {
                        this.state.games.length > 0 ? ( <
                            div className = { this.state.is_mobile ? classes.mobileRoot : classes.root } > {
                                this.state.games.map((game) => {
                                    game.players.sort(function(first, second) {
                                        if (first.rank === second.rank) {
                                            return 0;
                                        } else if (first.rank < second.rank) {
                                            return -1;
                                        } else {
                                            return 1;
                                        }
                                    });

                                    game.players[0].winner = true;
                                    console.log(game.players);

                                    let created_at = new Date(game.createdAt);
                                    return ( <
                                        ExpansionPanel key = { game.id } >
                                        <
                                        ExpansionPanelSummary expandIcon = { < ExpandMoreIcon / > } >
                                        <
                                        Typography className = { classes.heading } > { game.board_game.name } < /Typography> <
                                        Typography className = { classes.secondaryHeading } > { created_at.toLocaleString("fr-BE") } < /Typography> <
                                        /ExpansionPanelSummary> <
                                        ExpansionPanelDetails style = {
                                            { width: "50%" } } >
                                        <
                                        Grid item xs = { 12 } >
                                        <
                                        Grid container spacing = { 16 }
                                        alignItems = "center"
                                        direction = "row"
                                        justify = "flex-start" >
                                        <
                                        Grid item >
                                        <
                                        div className = { classes.tableWrapper } >
                                        <
                                        RankingTable ranking = { game.players }
                                        modifier = { a => a }
                                        isWinLose = { game.hasOwnProperty('ranking_method') && game.ranking_method === "WIN_LOSE" }
                                        /> <
                                        /div>

                                        <
                                        /Grid> <
                                        /Grid> <
                                        /Grid> <
                                        /ExpansionPanelDetails> <
                                        Divider / >
                                        <
                                        ExpansionPanelActions >
                                        <
                                        IconButton key = "close"
                                        aria - label = "Close"
                                        color = "inherit"
                                        onClick = {
                                            () => this.setState({ confirm_delete_open: true, game_to_delete: game.id }) } >
                                        <
                                        DeleteIcon / >
                                        <
                                        /IconButton> <
                                        /ExpansionPanelActions> <
                                        /ExpansionPanel>
                                    )
                                })
                            } <
                            /div>

                        ) : < Typography > No game found < /Typography>

                    }


                    <
                    /div>
                );
            }
        }

        Games.propTypes = {
            classes: PropTypes.object.isRequired,
        };

        export default withStyles(styles)(Games);