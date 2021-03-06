import Model from './Model';
import axios from 'axios';

/** Enum providing the game ranking methods */
export const GameRankingMethods = Object.freeze({
  WIN_LOSE: 'WIN_LOSE',
  POINTS_LOWER_BETTER: 'POINTS_LOWER_BETTER',
  POINTS_HIGHER_BETTER: 'POINTS_HIGHER_BETTER',
  RANKING_NO_POINT: 'RANKING_NO_POINT'
});

export default class Game extends Model {
  /** @inheritdoc */
  static get className() {
    return 'game';
  }

  /** @inheritdoc */
  _initProperties() {
    super._initProperties();

    this.id_event = null;
    this.id_board_game = null;
    this.started_at = null;
    this.duration = null;
    this.ranking_method = null;
    this.comment = null;

    this.board_game = null;
    this.players = []; // for creation, {Array<{user: Number, score: Number}>}
    this.expansions = [];
  }

  get isRanked() {
    return this.ranking_method !== 'WIN_LOSE';
  }

  get hasScores() {
    return this.isRanked && this.ranking_method !== GameRankingMethods.RANKING_NO_POINT;
  }

  static async fetchAllInEvent(idEvent, params={}) {
    if(idEvent == null) {
      throw new Error('Cannot fetch games of an event with no ID.');
    }
    let {data} = await axios.get(`event/${idEvent}/games`, {params});

    let processedCollection = [];
    data.forEach(elem => {
      let model = new this(elem);
      processedCollection.push(model);
    });

    return processedCollection;
  }

  static async fetchLatestInEvent(idEvent) {
    if(idEvent == null) {
      throw new Error('Cannot fetch latest games of an event with no ID.');
    }
    let {data} = await axios.get(`event/${idEvent}/games/latest`);

    let processedCollection = [];
    data.forEach(elem => {
      let model = new this(elem);
      processedCollection.push(model);
    });

    return processedCollection;
  }

  static async fetchSuggestedPlayers(params={}) {
    let {data} = await axios.get('suggest/game_players', {params});
    return data;
  }

  /**
   * @inheritdoc
   */
  async save() {
    return super.save({}, ['id_event']);
  }
}
