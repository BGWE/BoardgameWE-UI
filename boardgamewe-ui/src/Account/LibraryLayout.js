import React from 'react';
import BoardgamesList from "../Boardgames/BoardgamesList/BoardgamesList";

import BoardGame from "../utils/api/BoardGame.js";
import Library from "../utils/api/Library.js";

class LibraryLayout extends React.Component {

    constructor(props) {
        super(props);

        this.library = new Library();

        this.fetchGames = this.fetchGames.bind(this);
        this.addGame = this.addGame.bind(this);
        this.removeGame = this.removeGame.bind(this);
    }

    async fetchGames() {
        let data = await this.library.fetchGames();
        console.log(data);
        let boardGames = data.map(item => new BoardGame({owner: true, ...item.board_game}));
        return boardGames;
    }

    async addGame(boardGame) {
        let resp = await this.library.addGameFromBgg(boardGame.id);
        console.log(resp);
        return true;
    }

    async removeGame(id) {
        let resp = await this.library.removeGames([id]);
        console.log(resp);
        return true;
    }

    render() {
        return (
            <div>
                <h1>My library</h1>
                <BoardgamesList {...this.props}
                    fetchMethod={this.fetchGames}
                    addMethod={this.addGame}
                    removeMethod={this.removeGame} />
            </div>
        );
    }
}

export default LibraryLayout;
