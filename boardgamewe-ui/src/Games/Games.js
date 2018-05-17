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
    ExpansionPanelSummary, Grid,
    GridList,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Snackbar, TextField, Tooltip,

    Typography
} from "material-ui";

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Link from "react-router-dom/es/Link";

import AddGameModal from './AddGameModal'
import RankingTable from "../Rankings/RankingTable";

const styles = theme => ({
    root: {
        width: '70%',
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
});

class Games extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: [],
            n_cols: 4,
            isLoading: true,
            snackbar_error: false,
            open_modal: false
        };

        this.spacing = 10;

        // Bind this
        this.handleCloseSnack = this.handleCloseSnack.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch('http://api.boardgameweekend.party/games')
            .then(response => {
                if (!response.ok) throw Error('Request failed');
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                // let games = data.games.map((game) => {
                //     game.expanded = false;
                //     return game;
                // });
                this.setState({games: data, isLoading: false});
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({games: [], isLoading: false, snackbar_error: true});
            })
    }

    // handleExpandClick = (_id) => {
    //     let mod_state = this.state;
    //
    //     mod_state.games = mod_state.games.map((game) => {
    //         if (game.id === _id) {
    //             let mod_game = game;
    //             mod_game.expanded = !game.expanded;
    //             return mod_game;
    //         }
    //         return game;
    //     });
    //
    //     this.setState(mod_state);
    // };

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
                    open={this.state.snackbar_error}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">Error while fetching the games </span>}
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
                <div style={{width: "100%"}}>
                    <h1>Games</h1>
                </div>
                <div style={{paddingBottom: 20}}>
                    <Tooltip id="tooltip-fab" title="Add" placement="right">
                        <Link to="/games/add">
                            <Button variant="fab" color="secondary" aria-label="add">
                                <AddIcon />
                            </Button>
                        </Link>
                    </Tooltip>
                </div>

                {
                    this.state.games.length > 0 ? (
                        <div className={classes.root}>
                            {
                                this.state.games.map((game) => {
                                    game.players.sort(function (first, second) {
                                        if (first.rank === second.rank) {
                                            return 0;
                                        }
                                        else if (first.rank < second.rank) {
                                            return -1;
                                        }
                                        else {
                                            return 1;
                                        }
                                    });

                                    game.players[0].winner = true;
                                    console.log(game.players);

                                    let created_at = new Date(game.createdAt);
                                    return (
                                        <ExpansionPanel key={game.id}>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography className={classes.heading}>{game.board_game.name}</Typography>
                                                <Typography className={classes.secondaryHeading}>{created_at.toLocaleString("fr-BE")}</Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails style={{width: "50%"}}>
                                                <Grid item xs={12}>
                                                    <Grid
                                                        container
                                                        spacing={16}
                                                        alignItems="center"
                                                        direction="row"
                                                        justify="flex-start"
                                                    >
                                                        <Grid item>
                                                            <RankingTable ranking={game.players} />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    )
                                })
                            }
                        </div>

                    ) : <Typography>No game found</Typography>

                }


            </div>
        );
    }
}

Games.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Games);
