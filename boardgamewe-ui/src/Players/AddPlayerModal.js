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
import {IconButton, Snackbar, Tooltip} from "material-ui";
import CloseIcon from '@material-ui/icons/Close';

import PropTypes from 'prop-types';

export default class AddGameModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            name: "",
            email: "",
            snackbar_error: false,
            error_name: ""
        };

        this.handleCloseSnack = this.handleCloseSnack.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
    }



    handleClickOpenModal = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = name => event => {
        if (name === "") {
            this.setState({error_name: "Name should not be empty."});
            return
        } else {
            this.setState({error_name: ""});
        }

        this.setState({
            [name]: event.target.value,
        });
    };

    addPlayer(name, email) {
        if (name === "") {
            this.setState({error_name: "Name should not be empty."});
            return
        } else {
            this.setState({error_name: ""});
        }

        console.log("Adding " + name + " - " + email);
        this.setState({ open: false });

        let url = new URL('http://api.boardgameweekend.party/player/');
        let payload = {
            'name': name,
            'email': email
        };

        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({ open: false });
                this.props.reload();
            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.setState({ open: false, snackbar_error: true});
            }.bind(this));
    }

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbar_error: false})
    }

    render() {
        return (
            <div>
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
                    message={<span id="error_msg">Error while adding the player</span>}
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
                    <DialogTitle id="form-dialog-title">Add a player</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Let's add a player.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name*"
                            type="text"
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            error={this.state.error_name !== ""}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            label="Email"
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.addPlayer(this.state.name, this.state.email)} color="secondary" variant="raised">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AddGameModal.propTypes = {
    // reload: PropTypes.object.func,
};
