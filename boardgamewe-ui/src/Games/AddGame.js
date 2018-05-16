import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary, Grid,
    GridList,
    IconButton, InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, MenuItem, Paper,
    Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField,

    Typography
} from "material-ui";

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Link from "react-router-dom/es/Link";

import AddGameModal from './AddGameModal'
import Downshift from "downshift";
import Boardgame from "../Boardgames/Boardgame/Boardgame";
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import PersonAdd from "@material-ui/icons/PersonAdd";

const styles = theme => ({
    root: {
        width: '90%',
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

    downshift: {
        width: "66.66%"
    },

    table: {
        width: "30%"
    },

    inputRoot: {
        flexWrap: 'wrap',
    },

    gridInputsContainer: {
        flexGrow: 1,
    },

    score: {
        width: "55px"
    }
});

class AddGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,

            board_games: [],
            players: [],
            scores: [],

            isLoading: false,

            selected_board_game: null,
            selected_player: null,
            current_score: "",

            fetch_error: false,
            no_bg_selected_open: false,
            no_score_open: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleAddNewScore = this.handleAddNewScore.bind(this);
        this.handleChangeScore = this.handleChangeScore.bind(this);
        this.handleAddGame = this.handleAddGame.bind(this);
        this.handleCloseSnack = this.handleCloseSnack.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch('http://api.boardgameweekend.party/board_games')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({
                    board_games: data.board_games,
                    isLoading: false,
                    fetch_error: false
                });
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({
                    board_games: [],
                    isLoading: false,
                    fetch_error: true
                })
            });

        fetch('http://api.boardgameweekend.party/players')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({
                    players: data,
                    isLoading: false,
                    fetch_error: false
                })
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({
                    players: [],
                    isLoading: false,
                    fetch_error: true
                })
            });
    }


    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({fetch_error: false, no_bg_selected_open: false, no_score_open: false,})
    }

    sortByProp(data, prop) {
        return new Map([...data.entries()].sort((a, b) => a[1][prop] > b[1][prop]));
    };

    static renderInputBg(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                id="boardgame"
                label="Board game"
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                    },
                    startAdornment: (
                        <InputAdornment position="start">
                            <LibraryAdd />
                        </InputAdornment>
                    ),
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    getSuggestionsBg(inputValue) {
        let count = 0;

        return this.state.board_games.filter(suggestion => {
            const keep =
                (!inputValue || suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
                count < 5;

            if (keep) {
                count += 1;
            }

            return keep;
        });
    }

    static renderSuggestionBg({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;
        let isSelected = false;
        if (selectedItem && selectedItem.hasOwnProperty('name')) {
            isSelected = (selectedItem.name || '').indexOf(suggestion.name) > -1;
        }

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.id}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.name}
            </MenuItem>
        );
    }

    static renderInputPlayer(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                id="player"
                label="Player"
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                    },
                    startAdornment: (
                        <InputAdornment position="start">
                            <PersonAdd />
                        </InputAdornment>
                    ),
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    getSuggestionsPlayer(inputValue) {
        let count = 0;

        console.log(this.state.players);

        return this.state.players.filter(suggestion => {
            const keep =
                (!inputValue || suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
                count < 5;

            if (keep) {
                count += 1;
            }

            return keep;
        });
    }

    static renderSuggestionPlayer({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;
        let isSelected = false;
        if (selectedItem && selectedItem.hasOwnProperty('name')) {
            isSelected = (selectedItem.name || '').indexOf(suggestion.name) > -1;
        }

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.id}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.name}
            </MenuItem>
        );
    }

    handleChange(item, _key) {
        console.log(item);
        console.log(_key);
        this.setState({[_key]: item});
    }

    handleChangeScore(event) {
        this.setState({current_score: event.target.value});
    }

    handleAddNewScore() {
        console.log(this.state);
        console.log('Adding ' + this.state.selected_player.name + ' - ' + this.state.current_score);
        let current_scores = this.state.scores;
        current_scores.push({
            player: this.state.selected_player,
            score: this.state.current_score
        });
        this.setState({scores: current_scores, current_score: ""})
    }

    handleAddGame() {
        console.log(this.state.selected_board_game);
        console.log(this.state.scores);

        if (!this.state.selected_board_game) {
            this.setState({no_bg_selected_open: true});
            return
        }

        else if (this.state.scores.length <= 0) {
            this.setState({no_score_open: true});
            return
        }

        console.log('Adding new game');


        let url = new URL('http://api.boardgameweekend.party/game/');
        let payload = {
            'ranking_method': 'POINTS_HIGHER_BETTER',
            'board_game': this.state.selected_board_game.id,
            'duration': null,
            'players': this.state.scores.map(elem => {
                return {
                    'score': elem.score,
                    'player': elem.player.id
                }
            })
        };

        fetch(url, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.props.history.push('/games')
            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.setState({ open: false, snackbar_error: true});
            }.bind(this));
    }

    render () {
        const { classes } = this.props;
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }


        return (

            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.fetch_error}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">Error while fetching data</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnack}>
                            <CloseIcon/>
                        </IconButton>
                    ]} />

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.no_bg_selected_open}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">No board game selected</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnack}>
                            <CloseIcon/>
                        </IconButton>
                    ]}/>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.no_score_open}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">No score added</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnack}>
                            <CloseIcon/>
                        </IconButton>
                    ]}/>


                <div style={{width: "100%"}}>
                    <h2>Adding a game</h2>
                </div>

                {/*<div className={classes.downshift}>*/}
                    {/**/}
                {/*</div>*/}
                <br/>
                <div className={classes.downshift}>
                    <Grid container className={classes.root}>
                        <Grid item xs={12}>
                            <Downshift
                                onChange={(item) => this.handleChange(item, 'selected_board_game')}
                                itemToString={item => {
                                    if (!item) return "";
                                    if (!item.hasOwnProperty("name")) return "";
                                    return item.name
                                }}>
                                {
                                    ({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {

                                        return (
                                            <div className={classes.container}>
                                                {AddGame.renderInputBg({
                                                    fullWidth: true,
                                                    classes,
                                                    InputProps: getInputProps({
                                                        placeholder: 'Search a board game',
                                                        id: 'integration-downshift-simple',
                                                    }),
                                                })}
                                                {isOpen ? (
                                                    <Paper className={classes.paper} square>
                                                        {this.getSuggestionsBg(inputValue).map((suggestion, index) =>
                                                            AddGame.renderSuggestionBg({
                                                                suggestion,
                                                                index,
                                                                itemProps: getItemProps({ item: suggestion }),
                                                                highlightedIndex,
                                                                selectedItem,
                                                            }),
                                                        )}
                                                    </Paper>
                                                ) : null}
                                            </div>
                                        )
                                    }
                                }
                            </Downshift>
                        </Grid>


                        <Grid item xs={12}>
                            <Grid
                                container
                                spacing={16}
                                alignItems="center"
                                direction="row"
                                justify="flex-start"
                            >
                                <Grid item>
                                    <Downshift
                                        onChange={(item) => this.handleChange(item, 'selected_player')}
                                        itemToString={item => {
                                            if (!item) return "";
                                            if (!item.hasOwnProperty("name")) return "";
                                            return item.name
                                        }}>
                                        {
                                            ({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {

                                                return (
                                                    <div className={classes.container}>
                                                        {AddGame.renderInputPlayer({
                                                            fullWidth: true,
                                                            classes,
                                                            InputProps: getInputProps({
                                                                placeholder: 'Search a player',
                                                                id: 'player-downshift'
                                                            }),
                                                        })}
                                                        {isOpen ? (
                                                            <Paper className={classes.paper} square>
                                                                {this.getSuggestionsPlayer(inputValue).map((suggestion, index) =>
                                                                    AddGame.renderSuggestionPlayer({
                                                                        suggestion,
                                                                        index,
                                                                        itemProps: getItemProps({ item: suggestion }),
                                                                        highlightedIndex,
                                                                        selectedItem,
                                                                    }),
                                                                )}
                                                            </Paper>
                                                        ) : null}
                                                    </div>
                                                )
                                            }
                                        }
                                    </Downshift>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="score"
                                        label="Score"
                                        value={this.state.current_score}
                                        onChange={this.handleChangeScore}
                                        type="number"
                                        className={classes.score}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        style={{marginTop: "17px"}}
                                        size="small"
                                        variant="raised"
                                        color="primary"
                                        onClick={this.handleAddNewScore}>
                                        Add
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid
                                container
                                spacing={16}
                                alignItems="center"
                                direction="row"
                                justify="flex-start"
                            >
                                <Grid item style={{paddingTop: "30px"}}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Player</TableCell>
                                                <TableCell>Score</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.state.scores.map(p_score => {
                                                    return (
                                                        <TableRow key={p_score.player.id}>
                                                            <TableCell component="th" scope="row">
                                                                {p_score.player.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {p_score.score}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid
                                container
                                spacing={16}
                                alignItems="center"
                                direction="row"
                                justify="flex-start"
                            >
                                <Grid item style={{paddingTop: "30px"}}>
                                    <Button
                                        style={{marginTop: "17px"}}
                                        size="medium"
                                        variant="raised"
                                        color="secondary"
                                        onClick={this.handleAddGame}>
                                        Confirm
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </div>

            </div>
        );
    }
}

AddGame.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddGame);
