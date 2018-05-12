import React from 'react';
import {withStyles} from "material-ui/styles/index";
import {
    Button,
    Card,
    CardActions,
    CardContent, CircularProgress,
    Grid, LinearProgress,
    Typography
} from "material-ui";
import Subheader from 'material-ui/List/ListSubheader';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        raised: true,
        width: 200,
    }
});

class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hits: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const { name } = this.props.match.params;

        console.log(name);

        let url = new URL('http://bgwe-env.uqr3gutmpk.eu-west-1.elasticbeanstalk.com/board_game/search');
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
        let url = new URL('http://bgwe-env.uqr3gutmpk.eu-west-1.elasticbeanstalk.com/board_game/' + game_id);

        fetch(url, {
            method: 'PUT'
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.props.history.push('/boardgames')
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
                <Grid container spacing={16}>
                    {this.state.hits.map(tile => (
                        <Grid item key={tile.id}>
                            <Card key={tile.id} className={classes.card}>
                                <CardContent>
                                    <Typography variant="title" component="h5">
                                        {tile.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {tile.year}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => {this.setLoadingStateForTile(tile.id, true); this.addBoardGame(tile.id);}}>
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
