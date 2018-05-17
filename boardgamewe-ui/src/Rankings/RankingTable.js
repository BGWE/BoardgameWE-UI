import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {Table, TableBody, TableCell, TableHead, TableRow } from "material-ui";
import StarIcon from '@material-ui/icons/Star';

const colors = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#cd7f32"
};

const styles = theme => ({
    root: {
        width: '100%',
        alignItems: "center"
    },

    winnerRow: {
        fontWeight: 'bold'
    },

    gold_icon: {
        width: '20px',
        color: colors.gold
    },

    silver_icon: {
        width: '20px',
        color: colors.silver
    },

    bronze_icon: {
        width: '20px',
        color: colors.bronze
    },

    iconCell: {
        padding: "5px"
    },

    boldCell: {
        padding: "5px",
        fontWeight: "bold"
    }
});

class RankingTable extends React.Component {
    constructor(props) {
        super(props);
    }

    getIcon(rank, classes) {
        if (rank === 1) {
            return (<StarIcon className={classes.gold_icon}/>);
        } else if (rank === 2) {
            return (<StarIcon className={classes.silver_icon}/>);
        } else if (rank === 3) {
            return (<StarIcon className={classes.bronze_icon}/>);
        } else {
            return "";
        }
    }

    render () {
        const { classes } = this.props;

        console.log(this.props);

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.iconCell}/>
                        <TableCell>Rank</TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.ranking.slice(0, 10).map(player => (
                        <TableRow key={player.player.id} className={player.win ? classes.winnerRow : null}>
                            <TableCell className={classes.iconCell}>{this.getIcon(player.rank, classes)}</TableCell>
                            <TableCell>{player.rank}</TableCell>
                            <TableCell>{player.player.name.split(" ")[0]}</TableCell>
                            <TableCell>{this.props.modifier(player.score)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

// RankingTable.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(RankingTable);
