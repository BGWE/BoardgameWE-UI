import Model from './Model';
import axios from 'axios';
import Game from './Game';

export default class Event extends Model {
  /** @inheritdoc */
  static get className() {
    return 'event';
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

  static async fetchAll(ongoing, registered) {
    let urlParams = {};

    if ((ongoing === undefined && registered !== undefined) ||
        (ongoing !== undefined && registered === undefined)) {
      console.log('FetchAll events - Both ongoing and registered URL parameters should be provided to filter the events.');
    }

    else if(ongoing !== undefined && registered !== undefined) {
      urlParams['ongoing'] = ongoing;
      urlParams['registered'] = registered.join(',');
    }

    return super.fetchAll(urlParams);
  }

  async fetchGames() {
    return Game.fetchAllInEvent(this.id);
  }

  async fetchLatestGames() {
    return Game.fetchLatestInEvent(this.id);
  }

  get boardGamesUri() {
    if(this.isNew()) {
      throw new Error('Cannot construct board games URI of an event with no ID.');
    }
    return `event/${this.id}/board_games`;
  }

  boardGamesFromBggUri(bgg_id) {
    if(this.isNew()) {
      throw new Error('Cannot construct board games URI of an event with no ID.');
    }
    return `event/${this.id}/board_game/bgg/${bgg_id}`;
  }

  async fetchBoardGames() {
    let {data} = await axios.get(this.boardGamesUri);
    return data;
  }

  async addBoardGames(gamesIds) {
    let {data} = await axios.post(this.boardGamesUri, {board_games: gamesIds});
    return data;
  }

  async addBoardGameFromBgg(bggId) {
    let {data} = await axios.post(this.boardGamesFromBggUri(bggId), {});
    return data;
  }

  async removeBoardGames(gamesIds) {
    let {data} = await axios.delete(this.boardGamesUri, {data: {board_games: gamesIds}});
    return data;
  }

  get attendeesUri() {
    if(this.isNew()) {
      throw new Error('Cannot construct attendees URI of an event with no ID.');
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

  static get attendedEventsUri() {
    return 'events/current';
  }

  static async fetchAttendedEvents() {
    let {data} = await axios.get(Event.attendedEventsUri);
    return data;
  }

  /**
   * Subscribe connected user to the event
   */
  async subscribe() {
    if(this.isNew()) {
      throw new Error('Cannot subscribe to an event with no ID');
    }
    let {data} = await axios.post(`event/${this.id}/subscribe`);
    return data;
  }

  async fetchRankings() {
    if(this.isNew()) {
      throw new Error('Cannot fetch rankings for an event with no ID');
    }
    let {data} = await axios.get(`event/${this.id}/rankings`);
    return data;
  }

  /**
   * Fetch specific ranking corresponding to rankingType
   * rankingType may take the following values:
   * - gcbgb
   * - victory_count
   * - defeat_count
   * - victory_prop
   * - defeat_prop
   * - count_games
   * - count_unique_games
   * - is_last
   * - is_last_prop
   */
  async fetchRanking(rankingType) {
    if(this.isNew()) {
      throw new Error('Cannot fetch rankings for an event with no ID');
    }
    let {data} = await axios.get(`event/${this.id}/ranking/${rankingType}`);
    return data;
  }

  /**
   * Fetch event statistics
   * @returns {Object} Response from backend
   */
  async fetchStats() {
    let {data} = await axios.get(`/event/${this.id}/stats`);
    return data;
  }

  /**
   * Fetch event latest activities
   * @returns {Object} Response from backend
   */
  async fetchActivities() {
    let {data} = await axios.get(`/event/${this.id}/activities`);
    return data;
  }

}
