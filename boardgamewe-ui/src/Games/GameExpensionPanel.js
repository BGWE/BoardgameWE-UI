import React from 'react';
import PropTypes from 'prop-types';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";
import GameTable from "./GameTable";
import * as Helper from "../utils/Helper";


const styles = theme => ({
    root: {
        width: '100%',
        alignItems: "center"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        flexBasis: '33.33%'
    },
});

class GameExpensionPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    componentDidMount() {

    }


    render () {
        const { classes } = this.props;
        let game = this.props.game;

        // TODO sort a copy of the object
        game.players.sort(function (first, second) {
            return first.rank - second.rank;
        });

        game.players[0].winner = true;

        return (
            <ExpansionPanel key={game.id} >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>{game.board_game.name}</Typography>
                    <Typography className={classes.secondaryHeading}>{Helper.formatDatetime(game.createdAt)}</Typography>
                    {
                        game.duration ? <Typography className={classes.secondaryHeading}> Lasted {game.duration ? game.duration : ""} minutes </Typography> : ""
                    }
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{width: "80%", alignItems: 'center'}}>
                    <GameTable
                        game={game}
                        modifier={a => a}
                        isWinLose={game.hasOwnProperty('ranking_method') && game.ranking_method === "WIN_LOSE"}
                    />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

GameExpensionPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameExpensionPanel);
