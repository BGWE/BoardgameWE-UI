import React from 'react';
import BoardgamesList from "./BoardgamesList/BoardgamesList";

class Boardgames extends React.Component {
    render() {
        return (
            <div>
                <h1>Board Games</h1>
                <BoardgamesList ></BoardgamesList>
            </div>
        );
    }
}

export default Boardgames;
