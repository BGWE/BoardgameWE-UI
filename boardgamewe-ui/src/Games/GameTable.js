import React from 'react';

import StarIcon from '@material-ui/icons/Star';
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableHead from "@material-ui/core/TableHead/TableHead";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import { withStyles } from '@material-ui/core/styles';

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
            left: '20%'
        },
    }
});

class GameTable extends React.Component {
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

        console.log(this.props);
        var rank = 0;
        return (
            <Table padding={"dense"}>
                <TableHead>
                    <TableRow>
                        <TableCell> # </TableCell>
                        <TableCell> Player </TableCell>
                        {
                            this.props.isWinLose ? null:
                                (<TableCell numeric={true}> Score </TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.game ? this.props.game.players.slice(0, 10).map(player => (
                        <TableRow key={player.id_user} className={player.winner ? classes.winnerRow : null}>
                            <TableCell> {this.getIcon(rank += 1, classes)} </TableCell>
                            <TableCell className={player.winner ? classes.winnerCell : null}> {player.name ? player.name.split(" ")[0] : player.user.name} </TableCell>
                            {
                                this.props.isWinLose ? null:
                                    (<TableCell className={player.winner ? classes.winnerCell : null} numeric> {this.props.modifier(player.score)} </TableCell>)
                            }

                        </TableRow>
                    )) : ""}
                </TableBody>
            </Table>
        );
    }
}


export default withStyles(styles)(GameTable);
