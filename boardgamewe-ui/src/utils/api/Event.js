import Model from "./Model.js";
import axios from "axios";
import Game from "./Game.js";

export default class Event extends Model {
    /** @inheritdoc */
    static get className() {
        return "event";
    }

    /** @inheritdoc */
    _initProperties() {
        super._initProperties();

        this.name = null;
        this.start = null;
        this.end = null;
        this.description = null;
        this.location = null;
    }

    async fetchGames() {
        return Game.fetchAllInEvent(this.id);
    }

    get boardGamesUri() {
        if(this.isNew()) {
            throw new Error("Cannot construct board games URI of an event with no ID.");
        }
        return `event/${this.id}/board_games`;
    }

    static async fetchAllEvents() {
        let {data} = await axios.get("events");
        return data;
    }

    async fetchBoardGames() {
        let {data} = await axios.get(this.boardGamesUri);
        return data;
    }

    async addBoardGames(gamesIds) {
        let {data} = await axios.post(this.boardGamesUri, {board_games: gamesIds});
        return data;
    }

    async removeBoardGames(gamesIds) {
        let {data} = await axios.delete(this.boardGamesUri, {data: {board_games: gamesIds}});
        return data;
    }

    get attendeesUri() {
        if(this.isNew()) {
            throw new Error("Cannot construct attendees URI of an event with no ID.");
        }
        return `event/${this.id}/attendees`;
    }

    async fetchAttendees() {
        let {data} = await axios.get(this.attendeesUri);
        return data;
    }

    async addAttendees(attendeesIds) {
        let {data} = await axios.post(this.attendeesUri, {users: attendeesIds});
        return data;
    }

    async removeAttendees(attendeesIds) {
        let {data} = await axios.delete(this.attendeesUri, {data: {users: attendeesIds}});
        return data;
    }

    /**
     * Subscribe connected user to the event
     */
    async subscribe() {
        if(this.isNew()) {
            throw new Error("Cannot subscribe to an event with no ID");
        }
        let {data} = await axios.post(`event/${this.id}/subscribe`);
        return data;
    }

    async fetchRankings() {
        if(this.isNew()) {
            throw new Error("Cannot fetch rankings for an event with no ID");
        }
        let {data} = await axios.post(`event/${this.id}/rankings`);
        return data;
    }
}
