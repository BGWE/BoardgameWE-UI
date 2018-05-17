import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select,
    Snackbar, TextField
} from "material-ui";

import AddGame from "../AddGame/AddBoardGameModal";
import {Link} from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';


const styles = theme => ({
    root: {
    },
    gridList: {

    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    deleteIcon: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    search: {
        paddingBottom: "20px",
        marginRight: "auto",
        marginLeft: "45px",
        width: "150px"
    },
    gridContainer:{
        width: "90%",
    },
    tile: {
        // marginRight:"10px"
    }
});


const tileData = [
    {"id":4,"name":"Scythe","bgg_id":169786,"bgg_score":8.29447,"gameplay_video_url":"","min_players":1,"max_players":5,"min_playing_time":115,"max_playing_time":90,"playing_time":115,"thumbnail":"https://cf.geekdo-images.com/thumb/img/ZpuWhZuKrFry__SY8CTRuQp35rk=/fit-in/200x150/pic3163924.jpg","image":"https://cf.geekdo-images.com/original/img/enxCZt0Cn78-rlvmPvGtOej1ios=/0x0/pic3163924.jpg","description":"It is a time of unrest in 1920s Europa. The ashes from the first great war still darken the snow. The capitalistic city-state known simply as &ldquo;The Factory&rdquo;, which fueled the war with heavily armored mechs, has closed its doors, drawing the attention of several nearby countries.&#10;&#10;Scythe is an engine-building game set in an alternate-history 1920s period. It is a time of farming and war, broken hearts and rusted gears, innovation and valor. In Scythe, each player represents a character from one of five factions of Eastern Europe who are attempting to earn their fortune and claim their faction's stake in the land around the mysterious Factory. Players conquer territory, enlist new recruits, reap resources, gain villagers, build structures, and activate monstrous mechs.&#10;&#10;Each player begins the game with different resources (power, coins, combat acumen, and popularity), a different starting location, and a hidden goal. Starting positions are specially calibrated to contribute to each faction&rsquo;s uniqueness and the asymmetrical nature of the game (each faction always starts in the same place).&#10;&#10;Scythe gives players almost complete control over their fate. Other than each player&rsquo;s individual hidden objective card, the only elements of luck or variability are &ldquo;encounter&rdquo; cards that players will draw as they interact with the citizens of newly explored lands. Each encounter card provides the player with several options, allowing them to mitigate the luck of the draw through their selection. Combat is also driven by choices, not luck or randomness.&#10;&#10;Scythe uses a streamlined action-selection mechanism (no rounds or phases) to keep gameplay moving at a brisk pace and reduce downtime between turns. While there is plenty of direct conflict for players who seek it, there is no player elimination.&#10;&#10;Every part of Scythe has an aspect of engine-building to it. Players can upgrade actions to become more efficient, build structures that improve their position on the map, enlist new recruits to enhance character abilities, activate mechs to deter opponents from invading, and expand their borders to reap greater types and quantities of resources. These engine-building aspects create a sense of momentum and progress throughout the game. The order in which players improve their engine adds to the unique feel of each game, even when playing one faction multiple times.&#10;&#10;","year_published":2016,"category":"Civilization,Economic,Fighting,Miniatures,Science Fiction,Territory Building","mechanic":"Area Control / Area Influence,Grid Movement,Simultaneous Action Selection,Variable Player Powers","family":"Alternate History,Components: Miniatures,Crowdfunding: Kickstarter,Scythe,Solitaire Games,Tableau Building","createdAt":"2018-05-11T10:05:27.225Z","updatedAt":"2018-05-11T10:05:27.225Z"},
    {"id":5,"name":"Azul","bgg_id":230802,"bgg_score":8.01788,"gameplay_video_url":null,"min_players":2,"max_players":4,"min_playing_time":45,"max_playing_time":30,"playing_time":45,"thumbnail":"https://cf.geekdo-images.com/thumb/img/_ed_JktpgFwTr2WjEQgYMzHBvOQ=/fit-in/200x150/pic3718275.jpg","image":"https://cf.geekdo-images.com/original/img/9-SR48jyfxs4At6255sjHoly2sw=/0x0/pic3718275.jpg","description":"Introduced by the Moors, azulejos (originally white and blue ceramic tiles) were fully embraced by the Portuguese when their king Manuel I, on a visit to the Alhambra palace in Southern Spain, was mesmerized by the stunning beauty of the Moorish decorative tiles. The king, awestruck by the interior beauty of the Alhambra, immediately ordered that his own palace in Portugal be decorated with similar wall tiles. As a tile-laying artist, you have been challenged to embellish the walls of the Royal Palace of Evora.&#10;&#10;In the game Azul, players take turns drafting colored tiles from suppliers to their player board. Later in the round, players score points based on how they've placed their tiles to decorate the palace. Extra points are scored for specific patterns and completing sets; wasted supplies harm the player's score. The player with the most points at the end of the game wins.&#10;&#10;","year_published":2017,"category":"Abstract Strategy","mechanic":"Pattern Building,Set Collection,Tile Placement","family":"Country: Portugal","createdAt":"2018-05-11T11:09:09.928Z","updatedAt":"2018-05-11T11:09:09.928Z"},
    {"id":6,"name":"Azul","bgg_id":230802,"bgg_score":8.01788,"gameplay_video_url":null,"min_players":2,"max_players":4,"min_playing_time":45,"max_playing_time":30,"playing_time":45,"thumbnail":"https://cf.geekdo-images.com/thumb/img/_ed_JktpgFwTr2WjEQgYMzHBvOQ=/fit-in/200x150/pic3718275.jpg","image":"https://cf.geekdo-images.com/original/img/9-SR48jyfxs4At6255sjHoly2sw=/0x0/pic3718275.jpg","description":"Introduced by the Moors, azulejos (originally white and blue ceramic tiles) were fully embraced by the Portuguese when their king Manuel I, on a visit to the Alhambra palace in Southern Spain, was mesmerized by the stunning beauty of the Moorish decorative tiles. The king, awestruck by the interior beauty of the Alhambra, immediately ordered that his own palace in Portugal be decorated with similar wall tiles. As a tile-laying artist, you have been challenged to embellish the walls of the Royal Palace of Evora.&#10;&#10;In the game Azul, players take turns drafting colored tiles from suppliers to their player board. Later in the round, players score points based on how they've placed their tiles to decorate the palace. Extra points are scored for specific patterns and completing sets; wasted supplies harm the player's score. The player with the most points at the end of the game wins.&#10;&#10;","category":"Abstract Strategy","mechanic":"Pattern Building,Set Collection,Tile Placement","family":"Country: Portugal","createdAt":"2018-05-11T11:09:09.928Z","updatedAt":"2018-05-11T11:09:09.928Z"},
    {"id":7,"name":"Scythe","bgg_id":169786,"bgg_score":8.29447,"gameplay_video_url":"","min_players":1,"max_players":5,"min_playing_time":115,"max_playing_time":90,"playing_time":115,"thumbnail":"https://cf.geekdo-images.com/thumb/img/ZpuWhZuKrFry__SY8CTRuQp35rk=/fit-in/200x150/pic3163924.jpg","image":"https://cf.geekdo-images.com/original/img/enxCZt0Cn78-rlvmPvGtOej1ios=/0x0/pic3163924.jpg","description":"It is a time of unrest in 1920s Europa. The ashes from the first great war still darken the snow. The capitalistic city-state known simply as &ldquo;The Factory&rdquo;, which fueled the war with heavily armored mechs, has closed its doors, drawing the attention of several nearby countries.&#10;&#10;Scythe is an engine-building game set in an alternate-history 1920s period. It is a time of farming and war, broken hearts and rusted gears, innovation and valor. In Scythe, each player represents a character from one of five factions of Eastern Europe who are attempting to earn their fortune and claim their faction's stake in the land around the mysterious Factory. Players conquer territory, enlist new recruits, reap resources, gain villagers, build structures, and activate monstrous mechs.&#10;&#10;Each player begins the game with different resources (power, coins, combat acumen, and popularity), a different starting location, and a hidden goal. Starting positions are specially calibrated to contribute to each faction&rsquo;s uniqueness and the asymmetrical nature of the game (each faction always starts in the same place).&#10;&#10;Scythe gives players almost complete control over their fate. Other than each player&rsquo;s individual hidden objective card, the only elements of luck or variability are &ldquo;encounter&rdquo; cards that players will draw as they interact with the citizens of newly explored lands. Each encounter card provides the player with several options, allowing them to mitigate the luck of the draw through their selection. Combat is also driven by choices, not luck or randomness.&#10;&#10;Scythe uses a streamlined action-selection mechanism (no rounds or phases) to keep gameplay moving at a brisk pace and reduce downtime between turns. While there is plenty of direct conflict for players who seek it, there is no player elimination.&#10;&#10;Every part of Scythe has an aspect of engine-building to it. Players can upgrade actions to become more efficient, build structures that improve their position on the map, enlist new recruits to enhance character abilities, activate mechs to deter opponents from invading, and expand their borders to reap greater types and quantities of resources. These engine-building aspects create a sense of momentum and progress throughout the game. The order in which players improve their engine adds to the unique feel of each game, even when playing one faction multiple times.&#10;&#10;","year_published":2016,"category":"Civilization,Economic,Fighting,Miniatures,Science Fiction,Territory Building","mechanic":"Area Control / Area Influence,Grid Movement,Simultaneous Action Selection,Variable Player Powers","family":"Alternate History,Components: Miniatures,Crowdfunding: Kickstarter,Scythe,Solitaire Games,Tableau Building","createdAt":"2018-05-11T10:05:27.225Z","updatedAt":"2018-05-11T10:05:27.225Z"},
    {"id":8,"name":"Azul","bgg_id":230802,"bgg_score":8.01788,"gameplay_video_url":null,"min_players":2,"max_players":4,"min_playing_time":45,"max_playing_time":30,"playing_time":45,"thumbnail":"https://cf.geekdo-images.com/thumb/img/_ed_JktpgFwTr2WjEQgYMzHBvOQ=/fit-in/200x150/pic3718275.jpg","image":"https://cf.geekdo-images.com/original/img/9-SR48jyfxs4At6255sjHoly2sw=/0x0/pic3718275.jpg","description":"Introduced by the Moors, azulejos (originally white and blue ceramic tiles) were fully embraced by the Portuguese when their king Manuel I, on a visit to the Alhambra palace in Southern Spain, was mesmerized by the stunning beauty of the Moorish decorative tiles. The king, awestruck by the interior beauty of the Alhambra, immediately ordered that his own palace in Portugal be decorated with similar wall tiles. As a tile-laying artist, you have been challenged to embellish the walls of the Royal Palace of Evora.&#10;&#10;In the game Azul, players take turns drafting colored tiles from suppliers to their player board. Later in the round, players score points based on how they've placed their tiles to decorate the palace. Extra points are scored for specific patterns and completing sets; wasted supplies harm the player's score. The player with the most points at the end of the game wins.&#10;&#10;","year_published":2017,"category":"Abstract Strategy","mechanic":"Pattern Building,Set Collection,Tile Placement","family":"Country: Portugal","createdAt":"2018-05-11T11:09:09.928Z","updatedAt":"2018-05-11T11:09:09.928Z"},
    {"id":9,"name":"Azul","bgg_id":230802,"bgg_score":8.01788,"gameplay_video_url":null,"min_players":2,"max_players":4,"min_playing_time":45,"max_playing_time":30,"playing_time":45,"thumbnail":"https://cf.geekdo-images.com/thumb/img/_ed_JktpgFwTr2WjEQgYMzHBvOQ=/fit-in/200x150/pic3718275.jpg","image":"https://cf.geekdo-images.com/original/img/9-SR48jyfxs4At6255sjHoly2sw=/0x0/pic3718275.jpg","description":"Introduced by the Moors, azulejos (originally white and blue ceramic tiles) were fully embraced by the Portuguese when their king Manuel I, on a visit to the Alhambra palace in Southern Spain, was mesmerized by the stunning beauty of the Moorish decorative tiles. The king, awestruck by the interior beauty of the Alhambra, immediately ordered that his own palace in Portugal be decorated with similar wall tiles. As a tile-laying artist, you have been challenged to embellish the walls of the Royal Palace of Evora.&#10;&#10;In the game Azul, players take turns drafting colored tiles from suppliers to their player board. Later in the round, players score points based on how they've placed their tiles to decorate the palace. Extra points are scored for specific patterns and completing sets; wasted supplies harm the player's score. The player with the most points at the end of the game wins.&#10;&#10;","category":"Abstract Strategy","mechanic":"Pattern Building,Set Collection,Tile Placement","family":"Country: Portugal","createdAt":"2018-05-11T11:09:09.928Z","updatedAt":"2018-05-11T11:09:09.928Z"},
    {"id":10,"name":"Scythe","bgg_id":169786,"bgg_score":8.29447,"gameplay_video_url":"","min_players":1,"max_players":5,"min_playing_time":115,"max_playing_time":90,"playing_time":115,"thumbnail":"https://cf.geekdo-images.com/thumb/img/ZpuWhZuKrFry__SY8CTRuQp35rk=/fit-in/200x150/pic3163924.jpg","image":"https://cf.geekdo-images.com/original/img/enxCZt0Cn78-rlvmPvGtOej1ios=/0x0/pic3163924.jpg","description":"It is a time of unrest in 1920s Europa. The ashes from the first great war still darken the snow. The capitalistic city-state known simply as &ldquo;The Factory&rdquo;, which fueled the war with heavily armored mechs, has closed its doors, drawing the attention of several nearby countries.&#10;&#10;Scythe is an engine-building game set in an alternate-history 1920s period. It is a time of farming and war, broken hearts and rusted gears, innovation and valor. In Scythe, each player represents a character from one of five factions of Eastern Europe who are attempting to earn their fortune and claim their faction's stake in the land around the mysterious Factory. Players conquer territory, enlist new recruits, reap resources, gain villagers, build structures, and activate monstrous mechs.&#10;&#10;Each player begins the game with different resources (power, coins, combat acumen, and popularity), a different starting location, and a hidden goal. Starting positions are specially calibrated to contribute to each faction&rsquo;s uniqueness and the asymmetrical nature of the game (each faction always starts in the same place).&#10;&#10;Scythe gives players almost complete control over their fate. Other than each player&rsquo;s individual hidden objective card, the only elements of luck or variability are &ldquo;encounter&rdquo; cards that players will draw as they interact with the citizens of newly explored lands. Each encounter card provides the player with several options, allowing them to mitigate the luck of the draw through their selection. Combat is also driven by choices, not luck or randomness.&#10;&#10;Scythe uses a streamlined action-selection mechanism (no rounds or phases) to keep gameplay moving at a brisk pace and reduce downtime between turns. While there is plenty of direct conflict for players who seek it, there is no player elimination.&#10;&#10;Every part of Scythe has an aspect of engine-building to it. Players can upgrade actions to become more efficient, build structures that improve their position on the map, enlist new recruits to enhance character abilities, activate mechs to deter opponents from invading, and expand their borders to reap greater types and quantities of resources. These engine-building aspects create a sense of momentum and progress throughout the game. The order in which players improve their engine adds to the unique feel of each game, even when playing one faction multiple times.&#10;&#10;","year_published":2016,"category":"Civilization,Economic,Fighting,Miniatures,Science Fiction,Territory Building","mechanic":"Area Control / Area Influence,Grid Movement,Simultaneous Action Selection,Variable Player Powers","family":"Alternate History,Components: Miniatures,Crowdfunding: Kickstarter,Scythe,Solitaire Games,Tableau Building","createdAt":"2018-05-11T10:05:27.225Z","updatedAt":"2018-05-11T10:05:27.225Z"},
    {"id":11,"name":"Azul","bgg_id":230802,"bgg_score":8.01788,"gameplay_video_url":null,"min_players":2,"max_players":4,"min_playing_time":45,"max_playing_time":30,"playing_time":45,"thumbnail":"https://cf.geekdo-images.com/thumb/img/_ed_JktpgFwTr2WjEQgYMzHBvOQ=/fit-in/200x150/pic3718275.jpg","image":"https://cf.geekdo-images.com/original/img/9-SR48jyfxs4At6255sjHoly2sw=/0x0/pic3718275.jpg","description":"Introduced by the Moors, azulejos (originally white and blue ceramic tiles) were fully embraced by the Portuguese when their king Manuel I, on a visit to the Alhambra palace in Southern Spain, was mesmerized by the stunning beauty of the Moorish decorative tiles. The king, awestruck by the interior beauty of the Alhambra, immediately ordered that his own palace in Portugal be decorated with similar wall tiles. As a tile-laying artist, you have been challenged to embellish the walls of the Royal Palace of Evora.&#10;&#10;In the game Azul, players take turns drafting colored tiles from suppliers to their player board. Later in the round, players score points based on how they've placed their tiles to decorate the palace. Extra points are scored for specific patterns and completing sets; wasted supplies harm the player's score. The player with the most points at the end of the game wins.&#10;&#10;","year_published":2017,"category":"Abstract Strategy","mechanic":"Pattern Building,Set Collection,Tile Placement","family":"Country: Portugal","createdAt":"2018-05-11T11:09:09.928Z","updatedAt":"2018-05-11T11:09:09.928Z"}
    ];

class TitlebarGridList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hits: [],
            board_games: [],
            snackbar_error: false,
            order: 'alphabetical',
            n_cols: TitlebarGridList.get_number_of_columns_from_width(window.innerWidth),
            open_confirmation_dialog: false,
            confirm_delete_game_id: "",
            confirm_delete_game_name: "",

            filter_name: "",
            orderby: "name"
        };

        this.cellHeight = 180;
        this.spacing = 10;

        this.handleCloseSnack = this.handleCloseSnack.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
        this.handleDeleteBg = this.handleDeleteBg.bind(this);
        this.reload = this.reload.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this.handleChangeFilterText = this.handleChangeFilterText.bind(this);
        this.handleChangeOrderBy = this.handleChangeOrderBy.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.reload()
    }

    reload() {
        fetch('http://api.boardgameweekend.party/board_games')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({ hits: data.board_games, board_games: data.board_games, isLoading: false })
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({ snackbar_error: true, isLoading: false })
            });
    }

    order(games) {
        let build_sort = function(property, increasing_order) {
            return (first, second) => {
                let ret = 0;
                if (first[property] === second[property]) {
                    ret = 0;
                }
                else if (first[property] < second[property]) {
                    ret = -1;
                }
                else {
                    ret = 1;
                }

                return ret * (increasing_order ? 1 : -1)
            }
        };

        let name_order_fm = function (first, second) {
            if (first.name === second.name) {
                return 0;
            }
            else if (first.name < second.name) {
                return -1;
            }
            else {
                return 1;
            }
        };

        if (this.state.orderby === 'name') {
            return games.concat().sort(build_sort('name', true))
        }

        else if (this.state.orderby === 'name_reverse') {
            return games.concat().sort(build_sort('name', false))
        }

        else if (this.state.orderby === 'year_increasing') {
            return games.concat().sort(build_sort('year_published', true))
        }

        else if (this.state.orderby === 'year_decreasing') {
            return games.concat().sort(build_sort('year_published', false))
        }

        else if (this.state.orderby === 'score_increasing') {
            return games.concat().sort(build_sort('bgg_score', true))
        }

        else if (this.state.orderby === 'score_decreasing') {
            return games.concat().sort(build_sort('bgg_score', false))
        }

        return []
    }

    static get_number_of_columns_from_width(width) {
        if (width <= 700) {
            return 1
        }
        else if (width <= 830) {
            return 2
        }
        else if (width <= 1000) {
            return 3
        }
        else if (width <= 1200) {
            return 4
        }
        else if (width <= 1400) {
            return 5
        }
        else if (width <= 1600) {
            return 6
        }
        else if (width <= 1800) {
            return 7
        }

        return 8

    }

    handleWindowSizeChange = () => {
        this.setState({n_cols: TitlebarGridList.get_number_of_columns_from_width(window.innerWidth)})
    };

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbar_error: false})
    }

    handleCloseConfirm() {
        console.log('Close confirmation dialog');
        this.setState({
            open_confirmation_dialog: false,
            confirm_delete_game_id: "",
            confirm_delete_game_name: ""
        });
    }

    handleDeleteConfirm() {
        console.log('Deleting');
        let url = new URL('http://api.boardgameweekend.party/board_game/' + this.state.confirm_delete_game_id);

        fetch(url, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({
                    open_confirmation_dialog: false,
                    confirm_delete_game_id: "",
                    confirm_delete_game_name: ""
                });
                this.reload()
            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.setState({
                    open_confirmation_dialog: false,
                    confirm_delete_game_id: "",
                    confirm_delete_game_name: ""
                });
                this.reload()
            }.bind(this));
    }

    handleDeleteBg(bg_id, bg_name) {
        console.log('Confirming deletion of ' + bg_name + ' (' + bg_id + ')');
        this.setState({
            open_confirmation_dialog: true,
            confirm_delete_game_id: bg_id,
            confirm_delete_game_name: bg_name
        });
    }

    handleChangeFilterText(event) {
        let value = event.target.value;

        let filtered_hits = this.state.board_games.filter(suggestion => {
            return (!value || suggestion.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
        });

        this.setState({filter_name: event.target.value, hits: filtered_hits})
    }

    handleChangeOrderBy(event) {
        let value = event.target.value;
        console.log(value);
        this.setState({orderby: value});
    }

    render () {
        const { classes } = this.props;

        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }

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
                    message={<span id="error_msg">Error while fetching the board games</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnack}>
                            <CloseIcon/>
                        </IconButton>
                    ]}/>

                <Dialog
                    open={this.state.open_confirmation_dialog}
                    onClose={this.handleCloseConfirm}
                >
                    <DialogTitle id="alert-dialog-title">Confirm deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete {this.state.confirm_delete_game_name}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseConfirm} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleDeleteConfirm} color="secondary" variant="raised" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Grid container
                              justify="flex-start"
                              direction="row"
                              alignItems="center"
                              spacing={16}>
                            <Grid key="filter_item" item>
                                <TextField
                                    id="filter"
                                    label="Filter"
                                    className={classes.textField}
                                    value={this.state.filter_name}
                                    onChange={this.handleChangeFilterText}
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid key="order_by_item" item style={{marginTop: "8px"}}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="order">Order</InputLabel>
                                    <Select
                                        native
                                        value={this.state.orderby}
                                        onChange={this.handleChangeOrderBy}
                                    >
                                        <option value={"name"}>Name (A->Z)</option>
                                        <option value={"name_reverse"}>Name (Z->A)</option>
                                        <option value={"year_increasing"}>Year (Increasing)</option>
                                        <option value={"year_decreasing"}>Year (Decreasing)</option>
                                        <option value={"score_increasing"}>Score (Increasing)</option>
                                        <option value={"score_decreasing"}>Score (Decreasing)</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>


                <Grid container>
                    <Grid item xs={12} style={{marginTop: "25px"}}>
                        <GridList cellHeight={this.cellHeight} className={classes.gridList} cols={this.state.n_cols} spacing={this.spacing}>
                            <GridListTile key="add">
                                <AddGame />
                            </GridListTile>
                            {this.order(this.state.hits).map(tile => (
                                <GridListTile key={tile.id} className={classes.tile}>
                                    <img src={tile.thumbnail} alt={tile.name} />
                                    {
                                        <GridListTileBar
                                            titlePosition="top"
                                            actionIcon={
                                                <IconButton
                                                    className={classes.deleteIcon}
                                                    onClick={() => this.handleDeleteBg(tile.id, tile.name)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            }
                                            style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
                                        />
                                    }
                                    {
                                        <GridListTileBar
                                            title={tile.name}
                                            subtitle={tile.year_published ? (<span>({tile.year_published})</span>) : tile.year_published}
                                            actionIcon={
                                                <Link to={"/boardgame/" + tile.id} >
                                                    <IconButton className={classes.icon}>
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Link>
                                            }
                                        />
                                    }
                                </GridListTile>
                            ))}
                        </GridList>
                    </Grid>
                </Grid>



            </div>
        );
    }
}

TitlebarGridList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);
