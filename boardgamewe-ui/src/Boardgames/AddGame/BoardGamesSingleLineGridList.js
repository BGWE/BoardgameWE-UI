import React from "react";
import { withStyles } from '@material-ui/core/styles';

import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar/GridListTileBar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    addIcon: {
        color: 'white',
    },
    tile: {
        minWidth: "150px"
    }
});


class BoardGamesSingleLineGridList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <GridList className={classes.gridList} cols={2.5}>
                    {this.props.boardGames.map(tile => (
                        <GridListTile key={tile.id} className={classes.tile}>
                            <img src={tile.thumbnail} alt={tile.name} />
                            {
                                tile.owner &&
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
                                        <IconButton className={classes.icon} onClick={() => this.props.addBoardGameCb(tile)}>
                                            <AddIcon className={classes.addIcon} />
                                        </IconButton>
                                    }
                                />
                            }
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        );
    }
}

export default withStyles(styles)(BoardGamesSingleLineGridList);