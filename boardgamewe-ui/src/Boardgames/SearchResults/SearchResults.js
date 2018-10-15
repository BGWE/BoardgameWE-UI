import React from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import {
    Button,
    Card,
    CardActions,
    CardContent, CircularProgress,
    Grid, Snackbar,
    Typography
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import {Constants} from "../../utils/Constants";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        contained: true,
        width: 200,
    }
});

class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hits: [],
            isLoading: true,
            snackbar_success: false
        };

        this.handleCloseSnack = this.handleCloseSnack.bind(this);
        this.addBoardGame = this.addBoardGame.bind(this);
    }

    componentDidMount() {
        const { name } = this.props.match.params;

        console.log(name);

        let url = new URL(Constants.API_ADDRESS + '/board_game/search');
        url.searchParams.append('q', name);

        fetch(url)
            .then(response => response.json())
            .then(function (data) {
                this.setState({ hits: data.map((bg) => {bg['isLoading'] = false; return bg;}), isLoading: false });
                console.log(this.state);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    addBoardGame(game_id) {
        let url = new URL(Constants.API_ADDRESS + '/board_game/' + game_id);

        fetch(url, {
            method: 'PUT'
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({snackbar_success: true});
                setTimeout(function() {
                    // this.props.history.push('/boardgames')
                    this.props.history.goBack()
                }.bind(this), 1500);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    test(test_id) {
        console.log(test_id);
        console.log(this.state);
        
        // this.props.history.push('/boardgames')
    }
    
    setLoadingStateForTile(tile_id, state) {
        let mod_state = this.state;

        mod_state.hits = mod_state.hits.map((hit) => {
           if (hit.id === tile_id) {
               let mod_hit = hit;
               mod_hit.isLoading = state;
               return mod_hit;
           }
           return hit;
        });

        this.setState(mod_state)
    }

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbar_error: false})
    }

    render() {
        const { classes } = this.props;
        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }

        else if (!this.state.isLoading && this.state.hits.length <= 0) {
            return (
                <h1>No Game found</h1>
            )
        }

        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.snackbar_success}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">Board game successfully added</span>}
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
                <Grid container spacing={16}>
                    {this.state.hits.map(tile => (
                        <Grid item key={tile.id}>
                            <Card key={tile.id} className={classes.card}>
                                <CardContent>
                                    <Typography variant="h6" >
                                        {tile.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {tile.year}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => {this.setLoadingStateForTile(tile.id, true); this.addBoardGame(tile.id);}}
                                        disabled={tile.isLoading}>
                                        {tile.isLoading? (<CircularProgress thickness={4} size={20} />) : "Select"}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                    ))}
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(SearchResults);
