import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {
    CircularProgress, Collapse, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
    GridList, List, ListItem, ListItemIcon, ListItemText,

    Typography
} from "material-ui";

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';

const styles = theme => ({
    root: {
        width: '90%'
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
        };

        this.spacing = 10;
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch('http://bgwe-env.uqr3gutmpk.eu-west-1.elasticbeanstalk.com/games')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                // let games = data.games.map((game) => {
                //     game.expanded = false;
                //     return game;
                // });
                this.setState({games: data.games, isLoading: false});
                console.log(this.state);
            }.bind(this));
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

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <div style={{width: "100%"}}>
                    <h1>Games</h1>
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
                                            <ExpansionPanelDetails>
                                                <div className={classes.demo}>
                                                    <List>
                                                        {
                                                            game.players.map(function (player) {
                                                                return (
                                                                    <ListItem key={player.id_player}>
                                                                        {
                                                                            player.hasOwnProperty('winner') && player.winner ? (
                                                                                <ListItemIcon>
                                                                                    <StarIcon />
                                                                                </ListItemIcon>
                                                                            ) : null
                                                                        }
                                                                        <ListItemText inset
                                                                            primary={player.player.name}
                                                                            secondary={'Rank: ' + player.rank}
                                                                        />
                                                                    </ListItem>
                                                                )
                                                            })
                                                        }
                                                    </List>
                                                </div>
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
