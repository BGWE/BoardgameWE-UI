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

export default class BoardGameModal extends React.Component {
    state = {
        open: false,
        gamename: ""
    };

    handleClickOpen = () => {
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

    build_uri(q){
        return '/search/' + q;
    }

    render() {
        return (
            <div style={{paddingTop: 60}}>
                <Button onClick={this.handleClickOpen} variant="fab" color="secondary" aria-label="add">
                    <AddIcon />
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth={true}
                    maxWidth = {'sm'}
                >
                    <DialogTitle id="form-dialog-title">Add a board game</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Let's first search for your game.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label=" Board Game"
                            type="text"
                            value={this.state.gamename}
                            onChange={this.handleChange('gamename')}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Link to={this.build_uri(this.state.gamename)}>
                            <Button onClick={this.handleClose} color="primary">
                                Search
                            </Button>
                        </Link>

                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}