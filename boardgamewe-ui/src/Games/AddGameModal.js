import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import {Link} from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import {Tooltip} from "material-ui";

export default class AddGameModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            boardgame: "",
            isLoading: false,
            fetch_bg_error: false,
            fetch_players_error: false,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch('http://api.boardgameweekend.party/board_games')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({ isLoading: false })
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({ isLoading: false })
            });
    }

    handleClickOpenModal = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        return (
            <div>
                <Tooltip id="tooltip-fab" title="Add" placement="right">
                    <Button onClick={this.handleClickOpenModal} variant="fab" color="secondary" aria-label="add">
                        <AddIcon />
                    </Button>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}
                    maxWidth = {'sm'}
                >
                    <DialogTitle id="form-dialog-title">Add a game</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Let's add a game.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label=" Board Game"
                            type="text"
                            value={this.state.boardgame}
                            onChange={this.handleChange('gamename')}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Link to='/games' style={{ textDecoration: 'none' }}>
                            <Button onClick={this.handleClose} color="secondary" variant="raised">
                                Add
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}