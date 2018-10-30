import React from 'react';
import BoardgamesList from "./BoardgamesList/BoardgamesList";

import BoardGame from "../utils/api/BoardGame.js";

class Boardgames extends React.Component {

    constructor(props) {
        super(props);

        this.fetchGames = this.fetchGames.bind(this);
        this.addGame = this.addGame.bind(this);
        this.removeGame = this.removeGame.bind(this);
    }

    async fetchGames() {
        let data = await this.props.eventModel.fetchBoardGames();
        let boardGames = data.map(item => new BoardGame(item.provided_board_game));
        return boardGames;
    }

    async addGame(boardGame) {
        let resp = await this.props.eventModel.addBoardGameFromBgg(boardGame.id);
        console.log(resp);
        return true;
    }

    async removeGame(id) {
        let resp = await this.props.eventModel.removeBoardGames([id]);
        console.log(resp);
        return true;
    }

    render() {
        return (
            <div>
                <h1>Board Games</h1>
                <BoardgamesList {...this.props}
                    fetchMethod={this.fetchGames}
                    addMethod={this.addGame}
                    removeMethod={this.removeGame} />
            </div>
        );
    }
}

export default Boardgames;
