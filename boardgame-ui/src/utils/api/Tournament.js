import Model from './Model';

export default class Tournament extends Model {
  /** @inheritdoc */
  static get className() {
    return 'tournament';
  }

  /** @inheritdoc */
  _initProperties() {
    super._initProperties();

    this.id_board_game = null;
    this.ranking_system = null;
    this.name = null;
    this.description = null;
  }
}
