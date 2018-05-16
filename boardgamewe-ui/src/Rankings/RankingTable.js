import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";


const styles = theme => ({
    root: {
        width: '100%',
        alignItems: "center"
    }
});

class RankingTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        const { classes } = this.props;
        console.log("prop-render-rankingtable");
        console.log(this.props);
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
                        <TableRow key={player.player.id}>
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
