import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {Checkbox, CircularProgress, IconButton, Paper, Snackbar, Tooltip, Typography} from "material-ui";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import CloseIcon from '@material-ui/icons/Close';

import AddPlayerModal from './AddPlayerModal'

import {Constants} from "../utils/Constants";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    div_root: {
        // width: '20%',
        marginRight: 'auto',
        marginLeft: 'auto'
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

            snackbar_error: false,

            isLoading: true
        };

        this.handleCloseSnack = this.handleCloseSnack.bind(this);
        this.reload = this.reload.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        this.reload();
    }

    reload() {
        fetch(Constants.API_ADDRESS + '/players')
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                this.setState({players: data, isLoading: false})
            }.bind(this))
            .catch(error => {
                console.log(error);
                this.setState({snackbar_error: true, isLoading: false})
            });
    }

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbar_error: false})
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
        let empty_players = (<div style={{width: "100%"}}><Typography>No player found</Typography></div>);


        return (
            <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.snackbar_error}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnack}
                    ContentProps={{
                        'aria-describedby': "error_msg"
                    }}
                    message={<span id="error_msg">Error while fetching the players</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnack}>
                            <CloseIcon/>
                        </IconButton>
                    ]}/>

                <div style={{width: "100%"}}>
                    <h1>Players</h1>
                </div>
                <div style={{paddingBottom: 20, width: "100%"}}>
                    <AddPlayerModal reload={this.reload}/>
                </div>

                {
                    this.state.players.length > 0 ?
                        <div className={classes.div_root}>
                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            {/*<TableCell>Played</TableCell>*/}
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
                                                    {/*<TableCell numeric>*/}
                                                        {/*2*/}
                                                    {/*</TableCell>*/}
                                                </TableRow>
                                            );
                                        }, this)}

                                    </TableBody>
                                </Table>
                            </Paper>
                        </div>

                        :

                        empty_players
                }

            </div>
        );
    }
}

Players.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Players);
