import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table from "material-ui/es/Table/Table";
import TableHead from "material-ui/es/Table/TableHead";
import TableRow from "material-ui/es/Table/TableRow";
import TableCell from "material-ui/es/Table/TableCell";
import TableBody from "material-ui/es/Table/TableBody";

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
                        <TableRow>
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
