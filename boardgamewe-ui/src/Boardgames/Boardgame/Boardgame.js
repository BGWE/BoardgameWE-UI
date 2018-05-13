import React from 'react';
import {Button, CircularProgress, Divider, TextField} from "material-ui";
import {withStyles} from "material-ui/styles/index";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
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
        let url = 'http://bgwe-env.uqr3gutmpk.eu-west-1.elasticbeanstalk.com/board_game/' + this.state.data.id;
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'video_url': youtube_url
            })
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                // this.props.history.push('/boardgame/' + this.state.data.id);
                window.location.reload();
                this.setState({add_video_loading: false});

            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.setState({add_video_loading: false});
            }.bind(this));
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
                        label="youtube_url"
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
            gp_video = (<iframe width="560" height="315" src={"https://www.youtube.com/embed/" + y_id + "?rel=0"} frameBorder="0"
                allow="autoplay; encrypted-media" allowFullScreen></iframe>)
        }

        return (
            <div>
                <h1>{this.state.data.name}</h1>
                <Divider />
                <h4>Video</h4>
                {gp_video}
            </div>
        );
    }
}

export default withStyles(styles)(Boardgame);