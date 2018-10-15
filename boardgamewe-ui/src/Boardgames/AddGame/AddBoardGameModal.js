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


export default class BoardGameModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            gamename: "",
            redirect: false
        };

        this._handleKeyPress = this._handleKeyPress.bind(this);
    }



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

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            console.log(this.context);
            this.setState({redirect: true});
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.build_uri(this.state.gamename)} />;
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
                            onKeyPress={this._handleKeyPress}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary" >
                            Cancel
                        </Button>
                        <Link to={this.build_uri(this.state.gamename)} style={{ textDecoration: 'none' }}>
                            <Button onClick={this.handleClose} color="secondary" variant="contained">
                                Search
                            </Button>
                        </Link>

                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}