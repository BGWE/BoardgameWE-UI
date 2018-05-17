import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";


const styles = theme => ({
    root: {
        width: '100%',
        alignItems: "center"
    },

    winnerRow: {
        backgroundImage: 'radial-gradient(circle, #f5e258, #f7dd49, #f9d839, #fcd325, #ffcd00)',
        fontWeight: 'bold'
    }
});

class RankingTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        const { classes } = this.props;

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.ranking.map(player => (
                        <TableRow key={player.player.id} className={player.win ? classes.winnerRow : null}>
                            <TableCell>{player.rank}</TableCell>
                            <TableCell>{player.player.name}</TableCell>
                            <TableCell>{player.score}</TableCell>
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
