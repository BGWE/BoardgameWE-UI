import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    Button,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    GridList,
    IconButton, InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, MenuItem, Paper,
    Snackbar, TextField,

    Typography
} from "material-ui";

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Link from "react-router-dom/es/Link";

import AddGameModal from './AddGameModal'
import Downshift from "downshift";
import Boardgame from "../Boardgames/Boardgame/Boardgame";
import LibraryAdd from "@material-ui/icons/LibraryAdd";

const styles = theme => ({
    root: {
        width: '90%',
        marginRight: 'auto',
        marginLeft: 'auto'
    },

    gridList: {
        width: '80%',
        'padding-left': 0,
        'padding-right': 0,
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },

    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },

    downshift: {
        width: "33.33%"
    }
});

class AddGame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            board_games: [],
            players: [],
            isLoading: false,
            fetch_error: false,
            selectedBoardGame: null
        };

        this.handleChangeBg = this.handleChangeBg.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch('http://api.boardgameweekend.party/board_games')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({
                    board_games: data.board_games,
                    isLoading: false,
                    fetch_error: false
                });
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({
                    board_games: [],
                    isLoading: false,
                    fetch_error: true
                })
            });

        fetch('http://api.boardgameweekend.party/players')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({
                    players: data,
                    isLoading: false,
                    fetch_error: false
                })
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({
                    players: [],
                    isLoading: false,
                    fetch_error: true
                })
            });
    }

    handleClickAdd() {
        console.log('Opening modal');
        this.setState({open_modal: true});
    }

    handleCloseModal() {
        console.log('Closing modal');
        this.setState({open_modal: false});
    }

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbar_error: false})
    }

    sortByProp(data, prop) {
        return new Map([...data.entries()].sort((a, b) => a[1][prop] > b[1][prop]));
    };

    static renderInput(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                id="boardgame"
                label="Board game"
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                    },
                    startAdornment: (
                        <InputAdornment position="start">
                            <LibraryAdd />
                        </InputAdornment>
                    ),
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
                count < 5;

            if (keep) {
                count += 1;
            }

            return keep;
        });
    }

    static renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;
        console.log(selectedItem);
        let isSelected = false;
        if (selectedItem && selectedItem.hasOwnProperty('name')) {
            isSelected = (selectedItem.name || '').indexOf(suggestion.name) > -1;
        }

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.id}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.name}
            </MenuItem>
        );
    }

    handleChangeBg(item) {
        console.log(item);
    }

    render () {
        const { classes } = this.props;
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }

        // if (this.state.games.length)

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.fetch_error}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">Error while fetching data</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnack}>
                            <CloseIcon/>
                        </IconButton>
                    ]} />


                <div style={{width: "100%"}}>
                    <h2>Adding a game</h2>
                </div>

                <div className={classes.downshift}>
                    <Downshift
                        onChange={this.handleChangeBg}
                        itemToString={item => item.name}>
                        {
                            ({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {
                                return (
                                    <div className={classes.container}>
                                        {AddGame.renderInput({
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
                                                    AddGame.renderSuggestion({
                                                        suggestion,
                                                        index,
                                                        itemProps: getItemProps({ item: suggestion }),
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
                </div>


            </div>
        );
    }
}

AddGame.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddGame);
