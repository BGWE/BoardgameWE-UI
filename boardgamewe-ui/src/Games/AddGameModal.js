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
import {MenuItem, Paper, Tooltip, withStyles} from "material-ui";
import Downshift from "downshift";

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
});

class AddGameModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            board_games: [],
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
                this.setState({ board_games: data.board_games, isLoading: false })
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

    renderInput(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                    },
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    getSuggestions(inputValue) {
        let count = 0;

        return this.state.board_games.filter(suggestion => {
            const keep =
                (!inputValue || suggestion.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
                count < 2;

            if (keep) {
                count += 1;
            }

            return keep;
        });
    }

    renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.name}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.label}
            </MenuItem>
        );
    }

    render() {
        const { classes } = this.props;

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

                    <DialogContent style={{zIndex: 1}}>

                        <Downshift>
                            {
                                ({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {
                                    return (
                                        <div className={classes.container}>
                                            {this.renderInput({
                                                fullWidth: true,
                                                classes,
                                                InputProps: getInputProps({
                                                    placeholder: 'Search a board game',
                                                    id: 'integration-downshift-simple',
                                                }),
                                            })}
                                            {isOpen ? (
                                                <Paper className={classes.paper} square>
                                                    {this.getSuggestions(inputValue).map((suggestion, index) =>
                                                        this.renderSuggestion({
                                                            suggestion,
                                                            index,
                                                            itemProps: getItemProps({ item: suggestion.name }),
                                                            highlightedIndex,
                                                            selectedItem,
                                                        }),
                                                    )}
                                                </Paper>
                                            ) : null}
                                        </div>
                                    )
                                }
                            }
                        </Downshift>

                    </DialogContent>

                    <DialogActions style={{zIndex: 2}}>
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

export default withStyles(styles)(AddGameModal);