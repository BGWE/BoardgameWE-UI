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
import Event from "../../utils/api/Event";

const styles = theme => ({
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
    }
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
            addBoadGameToEventSnackbarFailOpen: false
        };

        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.generate = this.generate.bind(this);
        this.handleAddBoardGame = this.handleAddBoardGame.bind(this);
        this.reloadSearchResults = this.reloadSearchResults.bind(this);

        this.searchTextField = React.createRef()
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

    componentDidUpdate() {
        console.log("Did update");
        console.log(this.props)
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
        return boardGamesList.some((bg) => (bg[field].toString() === boardGameId))
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

    handleAddBoardGame = (boardGame) => {
        this.setState({
            boardGameToAdd: boardGame,
            isAdding: true
        });

        setTimeout(() => {
            let resp = this.props.addGameCb(boardGame);
            console.log(resp);

            if (resp === true) {
                this.setState({
                    addBoadGameToEventSnackbarSuccessOpen: true,
                });
            }

            boardGame.added = true;

            setTimeout(() => {
                this.setState({
                    isAdding: false
                });
                this.props.postCb(boardGame);
            }, 600);

        }, 800);

        // let resp = this.props.addGameCb(boardGame);
        // console.log(resp);
        //
        // this.setState({
        //     isAdding: false
        // });


        // if (resp === true) {
        //     this.setState({
        //         addBoadGameToEventSnackbarSuccessOpen: true,
        //     });
        // }


    };

    handleCloseSnackbar = () => {
        this.setState({
            addBoadGameToEventSnackbarSuccessOpen: false,
            addBoadGameToEventSnackbarFailOpen: false,
        });
    };

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

        let addBoadgameToEventSnackbarSuccess = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="success"
                message={`${lastBoardGameAddedName} has been added to the event.`}
                open={this.state.addBoadGameToEventSnackbarSuccessOpen}
                autoHideDuration={5000}
            />
        );

        let addBoadgameToEventSnackbarFail = (
            <CustomizedSnackbar
                onClose={this.handleCloseSnackbar}
                variant="error"
                message={`${lastBoardGameAddedName} failed to be added to the event.`}
                open={this.state.addBoadGameToEventSnackbarFailOpen}
                autoHideDuration={5000}
            />
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