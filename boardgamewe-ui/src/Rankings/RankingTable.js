import React from 'react';

import StarIcon from '@material-ui/icons/Star';
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableHead from "@material-ui/core/TableHead/TableHead";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography/Typography";

const colors = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#cd7f32"
};

const styles = theme => ({
    root: {
        width: '100%',
        alignItems: "center",
    },

    tableCell : {
        padding: '5px 8px 4px 8px',
    },

    winnerRow: {
        padding: 'dense',
        fontWeight: 'bold'
    },

    gold_icon: {
        width: '25px',
        color: colors.gold
    },

    silver_icon: {
        width: '25px',
        color: colors.silver
    },

    bronze_icon: {
        width: '25px',
        color: colors.bronze
    },

    boldCell: {
        fontWeight: "bold"
    },

    winnerCell: {
        fontWeight: 'bold',
    },
    wrapper: {
        position: "relative"
    },
    numberInIcon: {
        position: 'absolute',
        [theme.breakpoints.down('sm')] : {
            top: '18%',
            left: '70%'
        },
        [theme.breakpoints.up('md')] : {
            top: '12%',
            left: '40%'
        },

    }
});

class RankingTable extends React.Component {
    getIcon(rank, classes) {
        if (rank === 1) {
            return (
                <div className={classes.wrapper}>
                    <StarIcon className={classes.gold_icon}/>
                    <div className={classes.numberInIcon}>
                        {rank}
                    </div>
                </div>
        );
        } else if (rank === 2) {
            return (
                <div className={classes.wrapper}>
                    <StarIcon className={classes.silver_icon}/>
                    <div className={classes.numberInIcon}>
                        {rank}
                    </div>
                </div>
            );
        } else if (rank === 3) {
            return (
                <div className={classes.wrapper}>
                    <StarIcon className={classes.bronze_icon}/>
                    <div className={classes.numberInIcon}>
                        {rank}
                    </div>
                </div>
            );
        } else {
            return rank;
        }
    }

    render () {
        const { classes } = this.props;

        let isWinLose = this.props.isWinLose;
        if (isWinLose === null) {
            isWinLose = false;
        }

        console.log(this.props.ranking);

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell classes={{root : classes.tableCell}}>#</TableCell>
                        <TableCell classes={{root : classes.tableCell}}>Player</TableCell>
                        {
                            isWinLose ? null:
                                (<TableCell classes={{root : classes.tableCell}} numeric={true}>Score</TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.ranking ? this.props.ranking.slice(0, 10).map(player => (
                        <TableRow key={player.player.id_user} className={player.win ? classes.winnerRow : null}>
                            <TableCell classes={{root : classes.tableCell}}>{this.getIcon(player.rank, classes)} </TableCell>
                            <TableCell classes={{root : classes.tableCell}} className={player.win ? classes.winnerCell : null}>{player.player.name ? player.player.name.split(" ")[0] : player.player.user.name}</TableCell>
                            {
                                isWinLose ? null:
                                    (<TableCell classes={{root : classes.tableCell}} className={player.win ? classes.winnerCell : null} numeric={true}>{this.props.modifier(player.score)}</TableCell>)
                            }

                        </TableRow>
                    )) : ""}
                </TableBody>
            </Table>
        );
    }
}

// RankingTable.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(RankingTable);
