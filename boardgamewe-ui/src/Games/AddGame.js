import React from 'react';
import PropTypes from 'prop-types';

import Downshift from "downshift";

import CloseIcon from '@material-ui/icons/Close';
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import IconButton from "@material-ui/core/IconButton/IconButton";

import TextField from "@material-ui/core/TextField/TextField";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Grid from "@material-ui/core/Grid/Grid";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Paper from "@material-ui/core/Paper/Paper";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Button from "@material-ui/core/Button/Button";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Typography from "@material-ui/core/Typography/Typography";

import { withStyles } from '@material-ui/core/styles';
import Game, {GameRankingMethods} from "../utils/api/Game";

const game_durations = [
    {
        value: '15',
        label: '15'
    },
    {
        value: '30',
        label: '30'
    },
    {
        value: '45',
        label: '45'
    },
    {
        value: '60',
        label: '1h 0'
    },
    {
        value: '75',
        label: '1h 15'
    },
    {
        value: '90',
        label: '1h 30'
    },
    {
        value: '105',
        label: '1h 45'
    },
    {
        value: '120',
        label: '2h 0'
    },
    {
        value: '135',
        label: '2h 15'
    },
    {
        value: '160',
        label: '2h 30'
    },
    {
        value: '175',
        label: '2h 45'
    },
    {
        value: '190',
        label: '3h 0'
    },
];

const styles = theme => ({
    root: {
        width: '70%',
        marginRight: 'auto',
        marginLeft: 'auto'
    },

    inputRoot: {
        flexWrap: 'wrap',
    },

    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },

    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
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
            win_lose_scores: [],

            isLoading: false,

            selected_board_game: null,

            ranking_method: "ranked",
            game_duration: 15,

            selected_player: null,
            current_score: "",

            is_winner: false,

            fetch_error: false,
            no_bg_selected_open: false,
            no_score_open: false,
        };

        this.reload = this.reload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDownshiftChange = this.handleDownshiftChange.bind(this);
        this.handleAddNewScore = this.handleAddNewScore.bind(this);
        this.handleAddGame = this.handleAddGame.bind(this);
        this.handleCloseSnack = this.handleCloseSnack.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleRemoveWinLose = this.handleRemoveWinLose.bind(this);
        this.handleRemoveScore = this.handleRemoveScore.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
    }

    componentDidUpdate() {
        if (this.props.eventModel && this.state.isLoading) {
            this.reload();
        }
    }

    async reload() {
        try {
            let data = await this.props.eventModel.fetchBoardGames();

            this.setState({
                board_games: data,
                isLoading: false,
                fetch_error: false
            });
        } catch (e) {
            console.log(e);

            this.setState({
                board_games: [],
                isLoading: false,
                fetch_error: true
            });
        }

        try {
            let data = await this.props.eventModel.fetchAttendees();

            this.setState({
                players: data,
                isLoading: false,
                fetch_error: false
            });
        } catch (e) {
            console.log(e);

            this.setState({
                players: [],
                isLoading: false,
                fetch_error: true,
            });
        }
    }

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({fetch_error: false, no_bg_selected_open: false, no_score_open: false})
    }

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
                        input: classes.inputInput
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
                (!inputValue || suggestion.provided_board_game.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
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
            isSelected = (selectedItem.name || '').indexOf(suggestion.provided_board_game.name) > -1;
        }

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.id_board_game}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.provided_board_game.name}
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
                        input: classes.inputInput
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

        return this.state.players.filter(suggestion => {
            const keep =
                (!inputValue || suggestion.user.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
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

        if (selectedItem && selectedItem.user.hasOwnProperty('name')) {
            isSelected = (selectedItem.user.name || '').indexOf(suggestion.user.name) > -1;
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
                {suggestion.user.name}
            </MenuItem>
        );
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleDownshiftChange(item, _key) {
        this.setState({
            [_key]: item,
        });
    }

    handleCheckBox(event) {
        this.setState({is_winner: event.target.checked});
    }

    handleAddNewScore() {
        if (this.state.ranking_method === 'ranked') {
            console.log('Adding ' + this.state.selected_player.name + ' - ' + this.state.current_score);
            let current_scores = this.state.scores;
            current_scores.push({
                player: this.state.selected_player,
                score: this.state.current_score
            });
            this.setState({scores: current_scores, current_score: ""})
        }

        else {
            console.log('Adding ' + this.state.selected_player.name + ' - Win:' + this.state.is_winner);
            let current_scores = this.state.win_lose_scores;
            current_scores.push({
                player: this.state.selected_player,
                win: this.state.is_winner
            });
            this.setState({scores: current_scores, is_winner: false})
        }
    }

    async handleAddGame() {
        if (!this.state.selected_board_game) {
            this.setState({no_bg_selected_open: true});
            return
        }

        if (this.state.scores.length <= 0) {
            this.setState({no_score_open: true});
            return
        }

        let game = new Game();
        game.id_event = this.props.eventModel.id;
        game.id_board_game = this.state.selected_board_game.id;
        game.duration = this.state.game_duration;

        if (this.state.ranking_method === "ranked") {
            game.ranking_method = GameRankingMethods.POINTS_HIGHER_BETTER;
        }
        else {
            game.ranking_method = GameRankingMethods.WIN_LOSE;
        }

        if (this.state.ranking_method === "ranked") {
            game.players = this.state.scores.map(elem => {
                return {
                    'score': elem.score,
                    'user': elem.player.id
                }
            })
        }
        else {
            game.players = this.state.scores.map(elem => {
                return {
                    'score': elem.win ? 1 : 0,
                    'user': elem.player.id
                }
            })
        }

        try {
            console.log(game);
            await game.save();

            setTimeout(() => this.props.history.goBack(), 1500);

        } catch (e) {
            console.log(e);

            this.setState({
                open: false,
                snackbar_error: true
            });
        }
    }

    handleRemoveScore(p_score) {
        console.log(p_score);
        let current_scores = this.state.scores;

        this.setState({scores: current_scores.filter(function (_score) {
                return !(_score.player.name === p_score.player.name && _score.score === p_score.score)
            })})
    }

    handleRemoveWinLose(p_score) {
        console.log(p_score);
        let current_scores = this.state.win_lose_scores;

        this.setState({win_lose_scores: current_scores.filter(function (_score) {
                return !(_score.player.name === p_score.player.name && _score.win === p_score.win)
            })})
    }

    render () {
        const { classes } = this.props;

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
                    message={<span id="error_msg"> Error while fetching data </span>}
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

                <Grid
                    container
                    justify="center"
                    spacing={24}
                >
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h4"
                        >
                            Adding a game
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={8} container spacing={24} >
                        <Grid item xs={12} md={4}>
                            <Downshift
                                onChange={(item) => this.handleDownshiftChange(item.provided_board_game, 'selected_board_game')}
                                itemToString={item => {
                                    if (!item) return "";
                                    if (!item.provided_board_game.hasOwnProperty("name")) return "";
                                    return item.provided_board_game.name
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
                                                        id: 'bg-downshift',
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

                        <Grid item xs={5} md={3}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="age-native-simple"> Ranking method </InputLabel>
                                <Select
                                    native
                                    value={this.state.ranking_method}
                                    onChange={this.handleChange('ranking_method')}
                                    InputProps={{
                                        id: 'ranking-method',
                                    }}
                                >
                                    <option value={"ranked"}>Ranked</option>
                                    <option value={"win_lose"}>Win/Lose</option>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={5} md={3}>
                            <TextField
                                id="duration-select"
                                select
                                label="Game duration"
                                value={this.state.game_duration}
                                className={classes.formControl}
                                onChange={this.handleChange('game_duration')}
                                SelectProps={{
                                    native: true,
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {game_durations.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label + "min"}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>

                    </Grid>

                    <Grid item xs={12} md={8} container spacing={24}>
                        <Grid item xs={12} md={4}>
                            <Downshift
                                onChange={(item) => this.handleDownshiftChange(item.user, 'selected_player')}
                                itemToString={item => {
                                    if (!item) return "";
                                    if (!item.user.hasOwnProperty("name")) return "";
                                    return item.user.name
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
                        <Grid item xs={12} md={2}>
                            {
                                this.state.ranking_method === 'ranked' ?
                                    (
                                        <TextField
                                            id="score"
                                            label="Score"
                                            value={this.state.current_score}
                                            onChange={this.handleChange("current_score")}
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    ) : (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    icon={<StarBorder />}
                                                    checkedIcon={<Star />}
                                                    checked={this.state.is_winner}
                                                    onChange={this.handleCheckBox}/>
                                            }
                                            label="Winner"
                                        />
                                    )
                            }
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={this.handleAddNewScore}
                            >
                                Add player score
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox"/>
                                    <TableCell> Player </TableCell>
                                    <TableCell>
                                        {
                                            this.state.ranking_method === 'ranked' ? "Score" : "Won"
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                this.state.ranking_method === 'ranked' ? (
                                    <TableBody>
                                        {
                                            this.state.scores.map(p_score => {
                                                return (
                                                    <TableRow key={p_score.player.id}>
                                                        <TableCell padding="checkbox">
                                                            <IconButton
                                                            key="close"
                                                            aria-label="Close"
                                                            color="inherit"
                                                            onClick={() => this.handleRemoveScore(p_score)}
                                                            size={"small"}>
                                                                <CloseIcon/>
                                                            </IconButton>
                                                        </TableCell>
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
                                ) : (
                                    <TableBody>
                                        {
                                            this.state.win_lose_scores.map(p_score => {
                                                return (
                                                    <TableRow key={p_score.player.id}>
                                                        <TableCell padding="checkbox">
                                                            <IconButton
                                                                key="close"
                                                                aria-label="Close"
                                                                color="inherit"
                                                                onClick={() => this.handleRemoveWinLose(p_score)}
                                                                size={"small"}>
                                                                <CloseIcon/>
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {p_score.player.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {p_score.win ? "Yes" : "No"}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                )
                            }
                        </Table>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Button
                            size="medium"
                            variant="contained"
                            color="secondary"
                            onClick={this.handleAddGame}
                        >
                            Confirm
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

AddGame.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddGame);
