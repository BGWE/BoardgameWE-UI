import React from 'react';
import { withStyles } from 'material-ui/styles';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "material-ui";

const colors = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#cd7f32"
};

const styles = theme => ({
    root: {

    },

});

class ConfirmDeleteDialog extends React.Component {
    constructor(props) {
        super(props);
    }


    render () {
        const { classes, isOpen, fnCancel, fnConfirm, fnOnClose } = this.props;

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
                    <Button onClick={fnConfirm} color="secondary" variant="raised" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}


export default withStyles(styles)(ConfirmDeleteDialog);
