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
    },

    winnerCell: {
        fontWeight: 'bold',
    }
});

class RankingTable extends React.Component {
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

        let isWinLose = this.props.isWinLose;
        if (isWinLose === null) {
            isWinLose = false;
        }

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.iconCell}/>
                        <TableCell>Rank</TableCell>
                        <TableCell>Player</TableCell>
                        {
                            isWinLose ? null:
                                (<TableCell>Score</TableCell>)
                        }


                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.ranking ? this.props.ranking.slice(0, 10).map(player => (
                        <TableRow key={player.player.id} className={player.win ? classes.winnerRow : null}>
                            <TableCell className={classes.iconCell}>{this.getIcon(player.rank, classes)}</TableCell>
                            <TableCell className={player.win ? classes.winnerCell : null}>{player.rank}</TableCell>
                            <TableCell className={player.win ? classes.winnerCell : null}>{player.player.name.split(" ")[0]}</TableCell>
                            {
                                isWinLose ? null:
                                    (<TableCell className={player.win ? classes.winnerCell : null}>{this.props.modifier(player.score)}</TableCell>)
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
