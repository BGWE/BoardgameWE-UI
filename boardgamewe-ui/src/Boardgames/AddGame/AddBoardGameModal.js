import React from 'react';
import {Link, Redirect} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import {CircularProgress, withStyles} from "@material-ui/core";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Boardgame from "../../utils/api/BoardGame";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import CustomizedSnackbar from "../../utils/UI/Snackbar";
import Typography from "@material-ui/core/Typography/Typography";
import BoardGamesSingleLineGridList from "./BoardGamesSingleLineGridList";
import Library from "../../utils/api/Library";
import axios from "axios";
import * as Helper from "../../utils/Helper";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    dialog: {
        marginTop: "2px",
    },
    list: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    itemCircularProgress: {
        width: '30px'
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

const searchBoardGame = (text, preExecCb) => {
    preExecCb();
    return Boardgame.searchAll(text);
};

const searchAPIDebounced = AwesomeDebouncePromise(searchBoardGame, 700);
class BoardGameModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            gamename: "",
            redirect: false,
            isLoading: false,
            isAdding: false,

            boardGames: null,

            boardGameToAdd: null,
            addBoadGameToEventSnackbarSuccessOpen: false,
            addBoadGameToEventSnackbarFailOpen: false,

            libraryBoardGames: [],
        };

        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.generate = this.generate.bind(this);
        this.handleAddBoardGame = this.handleAddBoardGame.bind(this);
        this.reloadSearchResults = this.reloadSearchResults.bind(this);
        this.loadBoardGamesFromLibrary = this.loadBoardGamesFromLibrary.bind(this);
        this.addBoardGameFromLibraryCb = this.addBoardGameFromLibraryCb.bind(this);

        this.searchTextField = React.createRef()
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.loadBoardGamesFromLibrary();
    }

    reloadSearchResults() {
        if (this.state.boardGames !== null) {
            this.setState({
                boardGames: this.state.boardGames.map(boardGame => {
                    boardGame.added = BoardGameModal.checkAlreadyAdded(boardGame.id, this.props.boardGamesList, 'bgg_id');
                    return boardGame
                })
            });
        }
    }

    getDecodedToken() {
        let token = window.localStorage.accessToken;
        if (token != null) {
            let decoded_token = Helper.getTokenPayload(token);
            console.log("Decoded token");
            console.log(decoded_token);
            return decoded_token;
        }
        return null
    }

    getLibraryCurrentUser() {
        let decoded_token = this.getDecodedToken();
        if (decoded_token) {
            return new Library(decoded_token.id);
        }
        return null
    }

    boardGameInBoardGameList(boardGame, boardGameList) {
        return boardGameList.some((bg) => bg.id === boardGame.id);
    }

    async loadBoardGamesFromLibrary() {
        let library = this.getLibraryCurrentUser();
        if (library) {
            let libraryBoardGames = await library.fetchGames();
            libraryBoardGames = libraryBoardGames.map((bg) => bg.board_game);

            this.setState({
                libraryBoardGames: libraryBoardGames
            })
        }

    }

    handleClickOpen = () => {
        this.reloadSearchResults();
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = name => async event => {
        this.setState({
            [name]: event.target.value,
        });

        if (event.target.value.length > 2) {
            let data = await searchAPIDebounced(event.target.value, ()=>{this.setState({isLoading: true})});

            this.setState({
                boardGames: data.map(boardGame => {
                    boardGame.added = BoardGameModal.checkAlreadyAdded(boardGame.id, this.props.boardGamesList, 'bgg_id');
                    return boardGame
                }),
                isLoading: false
            });

            // Refocus on the search text field
            this.searchTextField.current.focus()
        }

    };

    static checkAlreadyAdded(boardGameId, boardGamesList, field) {
        return boardGamesList.some(bg => (bg[field].toString() === boardGameId && bg.owner))
    }

    static build_uri(q){
        return '/search/' + q;
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.setState({redirect: true});
        }
    }

    generate(boardGames) {
        if (boardGames === null) {
            return "";
        }

        if (boardGames.length === 0) {
            return (
                <ListItem key={"not_found"}>
                    <ListItemText
                        primary={"No board game found."}
                    />
                </ListItem>
            );
        }

        return boardGames.map(boardGame => {
            let boardGameState = "add";
            let icon = (<AddIcon/>);

            if (this.state.boardGameToAdd !== null && boardGame.id === this.state.boardGameToAdd.id && this.state.isAdding) {
                boardGameState = "inProgress";
                icon = (<CircularProgress thickness={2} size={22} /> );
            } else if (boardGame.added) {
                boardGameState = "added";
                icon = (<DoneIcon />);
            }

            return (
                <ListItem key={boardGame.id}>
                    <ListItemText
                        primary={boardGame.name}
                        secondary={boardGame.year}
                    />
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Add"
                            onClick={() => this.handleAddBoardGame(boardGame)}
                            disabled={boardGameState !== "add"}>
                            {icon}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        });
    }

    handleAddBoardGame = async (boardGame, fromBGG=true) => {
        this.setState({
            boardGameToAdd: boardGame,
            isAdding: true
        });

        try {
            await this.props.addGameCb(boardGame, fromBGG);
            boardGame.added = true;
            this.setState({addBoadGameToEventSnackbarSuccessOpen: true, isAdding: false});
            this.props.postCb(boardGame);
        }
        catch(error) {
            console.log(error);
            this.setState({ addBoadGameToEventSnackbarFailOpen: true, isAdding: false });
        }
    };

    handleCloseSnackbar = () => {
        this.setState({
            addBoadGameToEventSnackbarSuccessOpen: false,
            addBoadGameToEventSnackbarFailOpen: false,
        });
    };

    async addBoardGameFromLibraryCb(boardGame) {
        let resp = this.handleAddBoardGame(boardGame, false);
    }

    render() {
        const { classes } = this.props;

        if (this.state.redirect) {
            return <Redirect push to={BoardGameModal.build_uri(this.state.gamename)} />;
        }

        let results = null;

        if (this.state.isLoading) {
            results = (
                <div>
                    <CircularProgress thickness={5} />
                </div>
            )
        } else {
            results = (
                <List dense={true} className={classes.list}>
                    {this.generate(this.state.boardGames)}
                </List>
            )
        }

        let lastBoardGameAddedName = '';
        if (this.state.boardGameToAdd) {
            lastBoardGameAddedName = this.state.boardGameToAdd.name;
        }

        let filteredLibraryBoardGames = this.state.libraryBoardGames.filter((lbg) => !this.boardGameInBoardGameList(lbg, this.props.boardGamesList));

        let addBoadgameToEventSnackbarSuccess = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="success"
                message={`${lastBoardGameAddedName} has been added.`}
                open={this.state.addBoadGameToEventSnackbarSuccessOpen}
                autoHideDuration={5000}
            />
        );

        let addBoadgameToEventSnackbarFail = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="error"
                message={`Failed to add ${lastBoardGameAddedName}.`}
                open={this.state.addBoadGameToEventSnackbarFailOpen}
                autoHideDuration={5000}
            />
        );

        let fromLibrary = (
            <div>
                <Typography variant="subtitle1">
                    From my library
                </Typography>
                <BoardGamesSingleLineGridList
                    boardGames={filteredLibraryBoardGames}
                    addBoardGameCb={this.addBoardGameFromLibraryCb}/>
            </div>
        );

        return (
            <div style={{paddingTop: 60}}>
                {addBoadgameToEventSnackbarSuccess}
                {addBoadgameToEventSnackbarFail}
                <Tooltip id="tooltip-fab" title="Add" placement="bottom">
                    <Button onClick={this.handleClickOpen} variant="fab" color="secondary" aria-label="add">
                        <AddIcon />
                    </Button>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}
                    maxWidth = {'sm'}
                    className={classes.dialog}
                >
                    <DialogContent>
                        <DialogContentText>
                            Let's first search for your game.
                        </DialogContentText>
                        <br />
                        {this.props.showFromLibrary && filteredLibraryBoardGames.length > 0 ? fromLibrary : ""}
                        <br />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Search Board Game"
                            type="search"
                            variant="outlined"
                            value={this.state.gamename}
                            onChange={this.handleChange('gamename')}
                            disabled={this.state.isLoading}
                            inputRef={this.searchTextField}
                            fullWidth
                            onKeyPress={this._handleKeyPress}
                        />
                        {results}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary" >
                            Cancel
                        </Button>

                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default withStyles(styles)(BoardGameModal);