import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    Select,
    TextField
} from "@material-ui/core";

import CustomizedSnackbar from "../../utils/UI/Snackbar";

import AddGame from "../AddGame/AddBoardGameModal";
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Typography from "@material-ui/core/Typography/Typography";
import Boardgame from "../Boardgame/Boardgame";


const styles = theme => ({
    root: {
    },
    gridList: {

    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    deleteIcon: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    search: {
        paddingBottom: "20px",
        marginRight: "auto",
        marginLeft: "45px",
        width: "150px"
    },
    gridContainer:{
        width: "90%",
    },
    tile: {
        // marginRight:"10px"
    }
});

class TitlebarGridList extends React.Component {
    constructor(props) {
        super(props);

        this.uri = '/board_games';

        this.state = {
            board_games: [],
            snackbar_error: false,
            error_msg: "",
            order: 'alphabetical',
            n_cols: TitlebarGridList.get_number_of_columns_from_width(window.innerWidth),
            open_confirmation_dialog: false,
            confirm_delete_game_id: "",
            confirm_delete_game_name: "",
            min_player: 1,
            max_player: 20,

            filter_name: "",
            orderby: "name",

            viewBGOpen: false,
            viewBG: null
        };

        this.cellHeight = 180;
        this.spacing = 10;

        this.closeSnackbar = this.closeSnackbar.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
        this.handleDeleteBg = this.handleDeleteBg.bind(this);
        this.reload = this.reload.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this.handleChangeFilterText = this.handleChangeFilterText.bind(this);
        this.handleChangeOrderBy = this.handleChangeOrderBy.bind(this);
        this.handleChangeMinPlayer = this.handleChangeMinPlayer.bind(this);
        this.handleChangeMaxPlayer = this.handleChangeMaxPlayer.bind(this);
        this.postCb = this.postCb.bind(this);
        this.boardGameModal = this.boardGameModal.bind(this);
        this.handleOpenViewBg = this.handleOpenViewBg.bind(this);
        this.handleCloseViewBg = this.handleCloseViewBg.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.reload();
    }

    async reload() {
        try {
            let board_games = await this.props.fetchMethod();
            console.log(board_games);

            this.setState({
                board_games,
                isLoading: false,
                min_player: Math.min.apply(null, board_games.map(bg => bg.min_players)),
                max_player: Math.max.apply(null, board_games.map(bg => bg.max_players))
            });
        }
        catch(error) {
            console.log(error);
            this.setState({ snackbar_error: true, error_msg: "Error while fetching the board games", isLoading: false });
        }
    }

    order(games) {
        let build_sort = function(property, increasing_order) {
            return (first, second) => {
                let ret = 0;
                if (first[property] === second[property]) {
                    ret = 0;
                }
                else if (first[property] < second[property]) {
                    ret = -1;
                }
                else {
                    ret = 1;
                }

                return ret * (increasing_order ? 1 : -1)
            }
        };

        // let name_order_fm = function (first, second) {
        //     if (first.name === second.name) {
        //         return 0;
        //     }
        //     else if (first.name < second.name) {
        //         return -1;
        //     }
        //     else {
        //         return 1;
        //     }
        // };

        if (this.state.orderby === 'name') {
            return games.concat().sort(build_sort('name', true))
        }

        else if (this.state.orderby === 'name_reverse') {
            return games.concat().sort(build_sort('name', false))
        }

        else if (this.state.orderby === 'year_increasing') {
            return games.concat().sort(build_sort('year_published', true))
        }

        else if (this.state.orderby === 'year_decreasing') {
            return games.concat().sort(build_sort('year_published', false))
        }

        else if (this.state.orderby === 'score_increasing') {
            return games.concat().sort(build_sort('bgg_score', true))
        }

        else if (this.state.orderby === 'score_decreasing') {
            return games.concat().sort(build_sort('bgg_score', false))
        }

        return []
    }
    // min <= g.max && max >= g.min
    filter() {
        return this.state.board_games.filter(game => {
            // check interval intersection
            // console.log(game.name + " [ " + game.min_players + " -> " + game.max_players + "]: " + (this.state.min_player <= games.max_player && games.min_player <= this.state.max_player));
            return (!this.state.filter_name || game.name.toLowerCase().indexOf(this.state.filter_name.toLowerCase()) !== -1) &&
                (this.state.min_player <= game.max_players && game.min_players <= this.state.max_player);
            // return (!this.state.filter_name || game.name.toLowerCase().indexOf(this.state.filter_name.toLowerCase()) !== -1) &&
            //     (this.state.min_player <= 0 || (game.min_players <= this.state.min_player && this.state.min_player <= game.max_players)) &&
            //     (this.state.max_player <= 0 || (game.max_players >= this.state.max_player&& this.state.max_player >= game.min_players));
        });
    }

    static get_number_of_columns_from_width(width) {
        if (width <= 700) {
            return 1
        }
        else if (width <= 830) {
            return 2
        }
        else if (width <= 1000) {
            return 3
        }
        else if (width <= 1200) {
            return 4
        }
        else if (width <= 1400) {
            return 5
        }
        else if (width <= 1600) {
            return 6
        }
        else if (width <= 1800) {
            return 7
        }

        return 8

    }

    handleWindowSizeChange = () => {
        this.setState({n_cols: TitlebarGridList.get_number_of_columns_from_width(window.innerWidth)})
    };

    closeSnackbar() {
        this.setState({snackbar_error: false});
    }

    handleCloseConfirm() {
        this.setState({
            open_confirmation_dialog: false,
            confirm_delete_game_id: "",
            confirm_delete_game_name: ""
        });
    }

    async handleDeleteConfirm() {
        console.log('Deleting');
        try {
            await this.props.removeMethod(this.state.confirm_delete_game_id);
        }
        catch(error) {
            console.log(error);
            this.setState({
                snackbar_error: true,
                error_msg: "Failed to delete " + this.state.confirm_delete_game_name
            });
        }
        finally {
            this.setState({
                open_confirmation_dialog: false,
                confirm_delete_game_id: "",
                confirm_delete_game_name: ""
            });
            this.reload();
        }
    }

    handleDeleteBg(bg_id, bg_name) {
        console.log('Confirming deletion of ' + bg_name + ' (' + bg_id + ')');
        this.setState({
            open_confirmation_dialog: true,
            confirm_delete_game_id: bg_id,
            confirm_delete_game_name: bg_name
        });
    }

    handleChangeFilterText(event) {
        this.setState({filter_name: event.target.value})
    }

    handleChangeOrderBy(event) {
        let value = event.target.value;
        console.log(value);
        this.setState({orderby: value});
    }

    handleChangeMinPlayer(event) {
        let value = event.target.value;
        this.setState({min_player: value})
    }

    handleChangeMaxPlayer(event) {
        let value = event.target.value;
        this.setState({max_player: value})
    }

    postCb() {
        console.log("Post CB");
        this.reload();
    }

    boardGameModal() {
        const { classes } = this.props;
        return (
            <Dialog
                open={this.state.viewBGOpen}
                onClose={this.handleCloseViewBg}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth={"lg"}
                className={classes.dialog}
            >
                <DialogContent>
                    <DialogContentText>
                        Board Game
                    </DialogContentText>
                    <br />

                    <Boardgame boardgame={this.state.viewBG}/>


                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseViewBg} color="secondary" >
                        Exit
                    </Button>

                </DialogActions>
            </Dialog>
        )
    }

    handleOpenViewBg(boardgame) {
        this.setState({
            viewBGOpen: true,
            viewBG: boardgame
        })
    }

    handleCloseViewBg() {
        this.setState({
            viewBGOpen: false,
            viewBG: null
        })
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

        let filteredBoardGames = this.filter();
        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <CustomizedSnackbar
                    onClose={this.closeSnackbar}
                    variant="error"
                    message={this.state.error_msg}
                    open={this.state.snackbar_error}
                />

                <Dialog
                    open={this.state.open_confirmation_dialog}
                    onClose={this.handleCloseConfirm}
                >
                    <DialogTitle id="alert-dialog-title">Confirm deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete {this.state.confirm_delete_game_name}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseConfirm} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleDeleteConfirm} color="secondary" variant="contained" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {this.boardGameModal()}

                <Grid
                    container
                    spacing={8}
                    alignItems="flex-end">
                    <Grid item xs={6}>
                        <Grid container
                              justify="flex-start"
                              direction="row"
                              alignItems="center"
                              spacing={16}>

                            <Grid key="filter_item" item>
                                <TextField
                                    id="filter"
                                    label="Filter"
                                    className={classes.textField}
                                    value={this.state.filter_name}
                                    onChange={this.handleChangeFilterText}
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid key="order_by_item" item style={{marginTop: "8px"}}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="order">Order</InputLabel>
                                    <Select
                                        native
                                        value={this.state.orderby}
                                        onChange={this.handleChangeOrderBy}
                                    >
                                        <option value={"name"}>Name (A->Z)</option>
                                        <option value={"name_reverse"}>Name (Z->A)</option>
                                        <option value={"year_increasing"}>Year (Increasing)</option>
                                        <option value={"year_decreasing"}>Year (Decreasing)</option>
                                        <option value={"score_increasing"}>Score (Increasing)</option>
                                        <option value={"score_decreasing"}>Score (Decreasing)</option>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid key="filter_min_player" item>
                                <TextField
                                    id="filter_min_player"
                                    label="Min player"
                                    className={classes.textField}
                                    value={this.state.min_player}
                                    onChange={this.handleChangeMinPlayer}
                                    margin="normal"
                                    style={{width: "80px"}}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid key="filter_max_player" item>
                                <TextField
                                    id="filter_max_player"
                                    label="Max player"
                                    className={classes.textField}
                                    value={this.state.max_player}
                                    onChange={this.handleChangeMaxPlayer}
                                    margin="normal"
                                    style={{width: "80px"}}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PeopleIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item xs={2}>
                        {/*Hey*/}
                    </Grid>

                    <Grid item sm={4} xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Showing {filteredBoardGames.length}/{this.state.board_games.length} board games after filtering
                        </Typography>
                    </Grid>
                </Grid>

                {/* List */}
                <Grid container>
                    <Grid item xs={12} style={{marginTop: "5px"}}>
                        <GridList cellHeight={this.cellHeight} className={classes.gridList} cols={this.state.n_cols} spacing={this.spacing}>
                            <GridListTile key="add">
                                <AddGame
                                    boardGamesList={this.state.board_games}
                                    addGameCb={this.props.addMethod}
                                    postCb={this.postCb}
                                    showFromLibrary
                                />
                            </GridListTile>
                            {this.order(filteredBoardGames).map(tile => (
                                <GridListTile key={tile.id} className={classes.tile}>
                                    <img src={tile.thumbnail} alt={tile.name} />
                                    {
                                        tile.owner &&
                                        <GridListTileBar
                                            titlePosition="top"
                                            actionIcon={
                                                <IconButton
                                                    className={classes.deleteIcon}
                                                    onClick={() => this.handleDeleteBg(tile.id, tile.name)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            }
                                            style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
                                        />
                                    }
                                    {
                                        <GridListTileBar
                                            title={tile.name}
                                            subtitle={tile.year_published ? (<span>({tile.year_published})</span>) : tile.year_published}
                                            actionIcon={
                                                <IconButton className={classes.icon} onClick={() => this.handleOpenViewBg(tile)}>
                                                    <InfoIcon />
                                                </IconButton>
                                            }
                                        />
                                    }
                                </GridListTile>
                            ))}
                        </GridList>
                    </Grid>
                </Grid>



            </div>
        );
    }
}

TitlebarGridList.propTypes = {
    classes: PropTypes.object.isRequired,
    fetchMethod: PropTypes.func.isRequired,
    addMethod: PropTypes.func.isRequired,
    removeMethod: PropTypes.func.isRequired
};

export default withStyles(styles)(TitlebarGridList);
