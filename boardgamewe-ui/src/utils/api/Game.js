import Model from "./Model.js";
import axios from "axios";
import moment from "moment-timezone";

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

        this.id_event = null;
        this.id_board_game = null;
        this.duration = null;
        this.ranking_method = null;

        this.board_game = null;
        this.players = []; // for creation, {Array<{user: Number, score: Number}>}
    }

    /** @inheritdoc */
    get uri() {
        if(this.isNew()) {
            return `/event/${this.id_event}/${this.className}`;
        }
        else {
            return `${this.className}/${this.id}`;
        }
    }

    static async fetchAllInEvent(idEvent) {
        if(idEvent == null) {
            throw new Error("Cannot fetch games of an event with no ID.");
        }
        let {data} = await axios.get(`event/${idEvent}/games`);

        let processedCollection = [];
        data.forEach(elem => {
            let model = new this(elem);
            processedCollection.push(model);
        });

        return processedCollection;
    }

    static async fetchLatestInEvent(idEvent) {
        if(idEvent == null) {
            throw new Error("Cannot fetch latest games of an event with no ID.");
        }
        let {data} = await axios.get(`event/${idEvent}/games/latest`);

        let processedCollection = [];
        data.forEach(elem => {
            let model = new this(elem);
            processedCollection.push(model);
        });

        return processedCollection;
    }
}

export function compareGamesByCreation(game1, game2) {
    let moment1 = moment(game1.createdAt);
    let moment2 = moment(game2.createdAt);
    if (moment1.isBefore(moment2)) {
        return 1
    } else if (moment1.isAfter(moment2)) {
        return -1
    } else {
        return 0
    }
}