import Model from './Model';
import axios from 'axios';

export default class BoardGame extends Model {
  /** @inheritdoc */
  static get className() {
    return 'board_game';
  }

  /** @inheritdoc */
  _initProperties() {
    super._initProperties();

    this.bgg_id = null;
    this.bgg_score = null;
    this.thumbnail = null;
    this.image = null;
    this.description = null;
    this.year_published = null;
    this.category = null;
    this.mechanic = null;
    this.family = null;

    this.min_players = null;
    this.max_players = null;
    this.min_playing_time = null;
    this.max_playing_time = null;
    this.playing_time = null;

    this.gameplay_video_url = null;
  }

  /**
   * Search through all board games
   *
   * @param {String} str string to search
   *
   * @returns {Array<name, year, id>} The board games from BGG matching the search
   */
  static async searchAll(str) {
    let {data} = await axios.get(`board_game/search?q=${str}`);
    return data;
  }

  /**
   * Fetch expansions of a given board game
   *
   * @param {Number} id Board game identifier
   *
   * @returns {expansions: Array<BoardGame>, expansion_tree: Object} The expansions and tree structure
   */
  static async fetchExpansions(id) {
    let {data} = await axios.get(`board_game/${id}/expansions`);
    this.expansions = data;
    return data;
  }

  /**
   * Triggers an update of the expansions for the given board game 
   *
   * @param {Number} id Board game identifier
   *
   * @returns {expansions: Array<BoardGame>, expansion_tree: Object} The expansions and tree structure
   */
  static async updateExpansions(id) {
    let {data} = await axios.put(`board_game/${id}/expansions`);
    this.expansions = data;
    return data;
  }
}
