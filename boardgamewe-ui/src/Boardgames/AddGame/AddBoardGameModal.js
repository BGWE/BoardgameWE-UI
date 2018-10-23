import React from 'react';
import {Link, Redirect} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
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

            board_games: null
        };

        this._handleKeyPress = this._handleKeyPress.bind(this);
    }



    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = name => async event => {
        this.setState({
            [name]: event.target.value,
        });

        console.log(event.target.value);
        if (event.target.value.length > 2) {
            let data = await searchAPIDebounced(event.target.value, ()=>{this.setState({isLoading: true})});

            this.setState({
                board_games: data,
                isLoading: false
            });
        }

    };

    build_uri(q){
        return '/search/' + q;
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.setState({redirect: true});
        }
    }

    generate(element) {
        if (this.state.board_games === null) {
            return "";
        }

        if (this.state.board_games.length === 0) {
            return (
                <ListItem key={"not_found"}>
                    <ListItemText
                        primary={"No board game found."}
                    />
                </ListItem>
            );
        }

        return this.state.board_games.map(value =>
            (
                <ListItem key={value.id}>
                    <ListItemText
                        primary={value.name}
                        secondary={value.year}
                    />
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Delete">
                            <AddIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        );
    }

    render() {
        const { classes } = this.props;

        if (this.state.redirect) {
            return <Redirect push to={this.build_uri(this.state.gamename)} />;
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
                    {this.generate(
                        <ListItem>
                            <ListItemText
                                primary="Single-line item"
                                secondary={'Secondary text'}
                            />
                            <ListItemSecondaryAction>
                                <IconButton aria-label="Delete">
                                    <AddIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>,
                    )}
                </List>
            )
        }

        return (
            <div style={{paddingTop: 60}}>
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
                    {/*<DialogTitle id="form-dialog-title">Add a board game</DialogTitle>*/}
                    <DialogContent>
                        {/*<DialogContentText>*/}
                            {/*Let's first search for your game.*/}
                        {/*</DialogContentText>*/}
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
                            fullWidth
                            onKeyPress={this._handleKeyPress}
                        />
                        {/*<IntegrationDownshift />*/}
                        {results}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary" >
                            Cancel
                        </Button>
                        {/*<Link to={this.build_uri(this.state.gamename)} style={{ textDecoration: 'none' }}>*/}
                            {/*<Button onClick={this.handleClose} color="secondary" variant="contained">*/}
                                {/*Search*/}
                            {/*</Button>*/}
                        {/*</Link>*/}

                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(BoardGameModal);