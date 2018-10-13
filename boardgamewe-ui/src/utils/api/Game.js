import Model from "./Model.js";

/** Enum providing the game ranking methods */
export const GameRankingMethods = Object.freeze({
    WIN_LOSE: "WIN_LOSE",
    POINTS_LOWER_BETTER: "POINTS_LOWER_BETTER",
    POINTS_HIGHER_BETTER: "POINTS_HIGHER_BETTER"
});

export default class Game extends Model {
    /** @inheritdoc */
    static get className() {
        return "game";
    }

    /** @inheritdoc */
    _initProperties() {
        super._initProperties();

        this.id_board_game = null;
        this.duration = null;
        this.ranking_method = null;

        this.board_game = null;
        this.players = null;
    }
}