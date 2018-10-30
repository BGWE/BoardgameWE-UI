import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";


const styles = theme => ({
    root: {

    },

});

class ConfirmDeleteDialog extends React.Component {
    render () {
        const { isOpen, fnCancel, fnConfirm, fnOnClose } = this.props;

        return (
            <Dialog
                open={isOpen}
                onClose={fnOnClose}
            >
                <DialogTitle id="alert-dialog-title">Confirm deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={fnCancel} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={fnConfirm} color="secondary" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}


export default withStyles(styles)(ConfirmDeleteDialog);
