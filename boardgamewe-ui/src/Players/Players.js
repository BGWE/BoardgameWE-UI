import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

import AddPlayerModal from './AddPlayerModal'
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {withStyles} from '@material-ui/core/styles';

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
        this.setState({
            isLoading: true
        })
    }

    componentDidUpdate() {
        if (this.props.eventModel && this.state.isLoading) {
            this.reload();
        }
    }

    async reload() {
        try {
            let data = await this.props.eventModel.fetchAttendees();

            this.setState({
                players: data,
                isLoading: false});
        } catch (e) {
            console.log(e);

            this.setState({
                snackbar_error: true,
                isLoading: false
            });
        }
    }

    handleCloseSnack(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({snackbar_error: false})
    }

    render () {
        const { classes } = this.props;

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
