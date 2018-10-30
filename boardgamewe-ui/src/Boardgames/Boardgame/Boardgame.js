import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Chip from "@material-ui/core/Chip/Chip";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import OpenInNewIcon from "@material-ui/icons/OpenInNew"
import BoardGameModel from "../../utils/api/BoardGame.js";
import InfoCard from "./InfoCard";
import {htmlDecode} from "../../utils/Helper";

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    toolbar: {
        width: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    buttonInToolbar: {
        marginRight: 0,
        marginLeft: 'auto'
    },
    chip: {
        margin: theme.spacing.unit / 2,
        backgroundColor: "#008ba2",
        color: "white"
    },
    paper: {
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
    },
    image: {
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    card: {
        height:140,
        width:140
    },
    button:{
        fontSize: 12,
        marginTop: "10px",
        padding:"5px"
    }

});

class Boardgame extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            url_video: '',
            add_video_loading: false
        };

    }

    async componentDidMount() {
        this.setState({ isLoading: true });

        let bgid = null;
        if (this.props.boardgame !== null) {
            bgid = this.props.boardgame.id;
        } else {
            bgid = this.props.match.params;
        }

        let data = await BoardGameModel.fetch(bgid);
        this.setState({data: data, isLoading: false});
    }

    handleChange = url => event => {
        this.setState({
            [url]: event.target.value,
        });
        console.log(this.state)
    };

    addVideo(youtube_url) {
        this.setState({add_video_loading: true});
        console.log(youtube_url);
        this.updateVideo(youtube_url);
    }

    async updateVideo(youtube_url) {
        console.log('Updating video');

        let updatedBoardGame = this.state.data.clone();
        updatedBoardGame.gameplay_video_url = youtube_url;
        try {
            await updatedBoardGame.save();
            this.setState({data: updatedBoardGame, add_video_loading: false});
        }
        catch(error) {
            console.log(error);
            this.setState({add_video_loading: false});
        }
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

        // Misc
        let score = this.state.data.bgg_score;
        let rounded_score = String(parseFloat(score).toFixed(1));

        let num_players = this.state.data.min_players + " - " + this.state.data.max_players;
        if (this.state.data.min_players === this.state.data.max_players)
            num_players = this.state.data.min_players;

        let misc_tag = (
            <div style={{marginTop: 30, marginBottom: 30}}>

                <Grid item xs={12}>
                    <Grid container cols={3} justify="center" spacing={24}>
                        <InfoCard type="Playing time" value={this.state.data.playing_time} optional="minutes"/>
                        <InfoCard type="Players" value={num_players}/>
                        <InfoCard type="Score" value={rounded_score} optional="out of 10"/>
                    </Grid>
                </Grid>
            </div>
        );

        // Mechanics
        let mecanics_tag = null;
        if (this.state.data.mechanic) {
            let mechanics = this.state.data.mechanic.split(',');

            mecanics_tag = (
                    <Paper className={classes.paper}>
                        <List component="nav">
                            <ListItem>
                                <Typography variant="h5">
                                    Mechanics
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <div>
                                    {
                                        mechanics.map(data => {
                                            return (
                                                <Chip
                                                    key={data.replace(/[^A-Z0-9]/ig, "_")}
                                                    label={data}
                                                    className={classes.chip}
                                                />
                                            )
                                        })
                                    }
                                </div>

                            </ListItem>
                        </List>
                    </Paper>
            );
        }

        // Categories
        let categories_tag = null;
        if (this.state.data.category) {
            let categories = this.state.data.category.split(',');

            categories_tag = (
                    <Paper className={classes.paper}>
                        <List component="nav">
                            <ListItem>
                                <Typography variant="h5">
                                    Categories
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <div>
                                    {
                                        categories.map(data => {
                                            return (
                                                <Chip
                                                    key={data.replace(/[^A-Z0-9]/ig, "_")}
                                                    label={data}
                                                    className={classes.chip}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </ListItem>
                        </List>

                    </Paper>
            );
        }

        // Description
        let description_tag = null;

        if (this.state.data.description) {
            let description = htmlDecode(this.state.data.description);
            description_tag = (
                    <Paper className={classes.paper}>
                        <List component="nav">
                            <ListItem>
                                <Typography variant="h5">
                                    Description
                                </Typography>
                            </ListItem>
                            <ListItem>
                                {description}
                            </ListItem>
                        </List>
                    </Paper>
            );
        }



        // Video
        let gp_video = null;
        if (!this.state.data.gameplay_video_url) {
            let capt = "Add video";

            if (this.state.add_video_loading) {
                capt = (<CircularProgress thickness={4} size={20} color="inherit"/>)
            }

            gp_video = (
                <div>
                    <TextField
                        id="youtube_url"
                        label="Youtube URL"
                        className={classes.textField}
                        value={this.state.url_video}
                        onChange={this.handleChange('url_video')}
                        margin="normal"
                    />
                    <Button variant="contained" color="secondary" onClick={() => this.addVideo(this.state.url_video)}>{capt}</Button>
                </div>

            );
        } else {
            let parser = document.createElement('a');
            parser.href = this.state.data.gameplay_video_url;
            console.log(parser.search);
            let regex = new RegExp('\\?v=(.*)');
            let match = regex.exec(parser.search);
            let y_id = match[1];
            gp_video = (
                <div>
                    <iframe
                        width="560"
                        height="315"
                        src={"https://www.youtube.com/embed/" + y_id + "?rel=0"}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="Board Game Video"/>
                    {/*<Toolbar className={classes.toolbar}>*/}
                        {/*<Button variant="contained" className={classes.buttonInToolbar} onClick={() => this.addVideo("")}>Reset</Button>*/}
                    {/*</Toolbar>*/}
                </div>

            )
        }

        return (
            <div>
                <Typography variant="h3">
                    {this.state.data.name}
                </Typography>
                {
                    this.state.data.year_published ?
                        (<Typography variant="title">
                            ({this.state.data.year_published})
                        </Typography>) :
                        null
                }
                <a href={"https://boardgamegeek.com/boardgame/" + this.state.data.bgg_id} target="_blank" rel="noopener noreferrer" style={{textDecoration: "none"}}>
                    <Button className={classes.button} variant="text" color="primary" style={{fontSize: 12}}>
                        Board Game Geek
                        <OpenInNewIcon>Board Game Geek</OpenInNewIcon>
                    </Button>
                </a>

                <br/>
                <img src={this.state.data.image} alt="Board game" className={classes.image} style={{margin: 'auto', display: 'block'}}/>
                <br/>
                <div style={{width: '75%', marginLeft: 'auto', marginRight: 'auto'}}>
                    {misc_tag}
                    <br/>
                    {mecanics_tag}
                    <br/>
                    {categories_tag}
                    <br/>
                    {description_tag}
                    <br/>
                    <Paper>
                        <Typography variant="h5">
                            Video
                        </Typography>
                        {gp_video}
                    </Paper>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Boardgame);