import Model from './Model';
import axios from 'axios';
import Game from './Game';

/** Enum providing the game ranking methods */
export const EventVisibility = Object.freeze({
  SECRET: 'SECRET',
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC'
});

export const JoinRequestStatus = Object.freeze({
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED'
});

export const InviteStatus = Object.freeze({
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED'
});


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
    this.hide_rankings = false;
    this.visibility = EventVisibility.SECRET;
    this.attendees_can_edit = false;
    this.user_can_join = false;
    this.invite_required = true;
    this.attendees = [];
  }

  static async fetchAll({ongoing, registered, visibilities}) {
    let urlParams = {};

    if (ongoing !== undefined) {
      urlParams['ongoing'] = ongoing;
    }

    if (registered !== undefined) {
      urlParams['registered'] = registered;
    }

    if (visibilities !== undefined) {
      urlParams['visibility'] = visibilities;
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

  async fetchAttendees() {
    let {data} = await axios.get(`event/${this.id}/attendees`);
    this.attendees = data;
    return data;
  }

  async removeAttendee(id_user) {
    let {data} = await axios.delete(`event/${this.id}/attendee/${id_user}`);
    return data;
  }

  /**
   * Subscribe connected user to the event
   */
  async join() {
    if(this.isNew()) {
      throw new Error('Cannot join an event with no ID');
    }
    let {data} = await axios.post(`event/${this.id}/join`);
    return data;
  }

  static async joinWithId(id) {
    const data = new this({id}).join();
    return data;
  }

  /**
   * Join requests
   */
  async sendJoinRequest() {
    if(this.isNew()) {
      throw new Error('Cannot send request for an event with no ID');
    }
    let {data} = await axios.post(`event/${this.id}/join_request`);
    return data;
  }

  async handleJoinRequest(id_requester, accept) {
    if (this.isNew()) {
      throw new Error('Cannot handle request for an event with no ID');
    }
    let {data} = await axios.put(`event/${this.id}/join_request`, { id_requester, accept });
    return data;
  }

  async fetchJoinRequests() {
    if (this.isNew()) {
      throw new Error('Cannot handle request for an event with no ID');
    }
    let {data} = await axios.get(`event/${this.id}/join_requests`);
    return data;
  }

  /**
   * Invites
   */
  async fetchInvites() {
    let {data} = await axios.get(`event/${this.id}/invites`);
    return data;
  }

  async sendInvite(id_invitee) {
    if(this.isNew()) {
      throw new Error('Cannot send invite for an event with no ID');
    }
    let {data} = await axios.post(`event/${this.id}/invite`, { id_invitee });
    return data;
  }

  // current user invite against this event
  async handleInvite(accept) {
    if(this.isNew()) {
      throw new Error('Cannot handle invite for an event with no ID');
    }
    let {data} = await axios.put(`event/${this.id}/invite`, { accept });
    return data;
  }

  static async getCurrentUserReceivedInvites() {
    let {data} = await axios.put('user/current/invites');
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

  /**
   * Fetch the board games that the event attendees have added to their wish to play list
   * @returns {Array<id_board_game, count, board_game>} The list of wished board games, along with the number of attendees that want to play it
   */
  async fetchWishedBoardGames({exclude_current, provided_games_only}={}) {
    let {data} = await axios.get(`/event/${this.id}/wish_to_play`, {params: {exclude_current, provided_games_only}});
    return data;
  }

  /**
   * Fetch the matchmaking data for the event (based on wish lists of attendees)
   * @returns {Array<board_game, users>} The list of matchmaking suggestions, each composed of a board game and the list of players that want to play it
   */
  async fetchMatchmaking() {
    let {data} = await axios.get(`/event/${this.id}/matchmaking`);
    return data;
  }

  async getCurrentUserTimers() {
    let {data} = await axios.get(`event/${this.id}/timers`);
    return data;
  }

}
