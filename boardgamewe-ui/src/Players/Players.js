import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {Checkbox, CircularProgress, Paper, Tooltip} from "material-ui";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        width: '80%'
    }
});

class Players extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],

            isLoading: true
        };

    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch('http://api.boardgameweekend.party/players')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({players: data, isLoading: false})
            }.bind(this));
    }

    render () {
        const { classes } = this.props;
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <CircularProgress thickness={7} />
                </div>
            )
        }

        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <div style={{width: "100%"}}>
                    <h1>Players</h1>
                </div>

                <div>
                    <Paper className={classes.paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Played</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.players.map(column => {
                                    return (
                                        <TableRow key={column.id}>
                                            <TableCell
                                                numeric={column.numeric}
                                                padding={column.disablePadding ? 'none' : 'default'}
                                            >
                                                {column.name}
                                            </TableCell>
                                            <TableCell numeric>
                                                2
                                            </TableCell>
                                        </TableRow>
                                    );
                                }, this)}

                            </TableBody>
                        </Table>
                    </Paper>
                </div>

            </div>
        );
    }
}

Players.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Players);
