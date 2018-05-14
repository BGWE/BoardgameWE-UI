import React from 'react';
import {
    Button, Card, CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    List,
    ListItem,
    Paper,
    TextField,
    Toolbar,
    Typography
} from "material-ui";
import {withStyles} from "material-ui/styles/index";

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
        width: '30%'
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

    componentDidMount() {
        this.setState({ isLoading: true });

        const { bgid } = this.props.match.params;


        fetch('http://bgwe-env.uqr3gutmpk.eu-west-1.elasticbeanstalk.com/board_game/' + bgid)
            .then(response => response.json())
            .then(function (data) {
                this.setState({ data: data, isLoading: false });
                console.log(this.state);
            }.bind(this));
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

    updateVideo(youtube_url) {
        console.log('Updating video');
        let url = 'http://bgwe-env.uqr3gutmpk.eu-west-1.elasticbeanstalk.com/board_game/' + this.state.data.id;
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'video_url': youtube_url
            })
        })
            .then(function (_data_returned) {
                console.log(_data_returned);
                let current_data = this.state.data;
                current_data.gameplay_video_url = youtube_url;
                console.log(this.state);
                console.log(current_data);
                this.setState({data: current_data, add_video_loading: false});
                console.log(this.state);

            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.setState({add_video_loading: false});
            }.bind(this));
    }

    unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi,
            function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
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
        let misc_tag = (
            <div style={{marginTop: 30, marginBottom: 30}}>
                 <Grid container cols={3} className={classes.toolbar} justify="center" spacing={24}>
                    <Grid item>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary">
                                    Playing Time
                                </Typography>
                                <Typography variant="headline" component="h2">
                                    {this.state.data.playing_time}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    minutes
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                     <Grid item>
                         <Card className={classes.card}>
                             <CardContent>
                                 <Typography className={classes.title} color="textSecondary">
                                     Players
                                 </Typography>
                                 <Typography variant="headline" component="h2">
                                     {this.state.data.min_players} - {this.state.data.max_players}
                                 </Typography>
                                 {/*<Typography className={classes.pos} color="textSecondary">*/}
                                     {/*players*/}
                                 {/*</Typography>*/}
                             </CardContent>
                         </Card>
                     </Grid>

                     <Grid item>
                         <Card className={classes.card}>
                             <CardContent>
                                 <Typography className={classes.title} color="textSecondary">
                                     Score
                                 </Typography>
                                 <Typography variant="headline" component="h2">
                                     {rounded_score}
                                 </Typography>
                                 <Typography className={classes.pos} color="textSecondary">
                                     out of 10
                                 </Typography>
                             </CardContent>
                         </Card>
                     </Grid>
                </Grid>
            </div>
        );

        // Mechanics
        let mecanics_tag = null;
        if (this.state.data.mechanic) {
            let mechanics = this.state.data.mechanic.split(',');

            mecanics_tag = (
                <div>
                    <Paper className={classes.paper}>
                        <List component="nav">
                            <ListItem>
                                <Typography variant="headline">
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
                    <br/>
                </div>
            );
        }

        // Categories
        let categories_tag = null;
        if (this.state.data.category) {
            let categories = this.state.data.category.split(',');

            categories_tag = (
                <div>
                    <Paper className={classes.paper}>
                        <List component="nav">
                            <ListItem>
                                <Typography variant="headline">
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
                    <br/>
                </div>
            );
        }

        // Description
        let description_tag = null;

        if (this.state.data.description) {
            let description = this.state.data.description;
            description_tag = (
                <div>
                    <Paper className={classes.paper}>
                        <List component="nav">
                            <ListItem>
                                <Typography variant="headline">
                                    Description
                                </Typography>
                            </ListItem>
                            <ListItem>
                                {description}
                            </ListItem>
                        </List>

                    </Paper>
                    <br/>
                </div>
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
                    <Button variant="raised" color="secondary" onClick={() => this.addVideo(this.state.url_video)}>{capt}</Button>
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
                    <iframe width="560" height="315" src={"https://www.youtube.com/embed/" + y_id + "?rel=0"} frameBorder="0"
                            allow="autoplay; encrypted-media" allowFullScreen></iframe>
                    {/*<Toolbar className={classes.toolbar}>*/}
                        {/*<Button variant="raised" className={classes.buttonInToolbar} onClick={() => this.addVideo("")}>Reset</Button>*/}
                    {/*</Toolbar>*/}
                </div>

            )
        }

        return (
            <div>
                <Typography variant="display2">
                    {this.state.data.name}
                </Typography>
                {
                    this.state.data.year_published ?
                        (<Typography variant="title">
                            ({this.state.data.year_published})
                        </Typography>) :
                        null
                }
                <br/>
                <img src={this.state.data.image} alt="Board game image" className={classes.image}/>
                <br/>
                <div style={{width: '70%', marginLeft: 'auto', marginRight: 'auto'}}>
                    {misc_tag}
                    {mecanics_tag}
                    {categories_tag}
                    {description_tag}
                    <Paper>
                        <Typography variant="headline">
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