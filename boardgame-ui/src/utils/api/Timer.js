import Model from './Model';
import axios from 'axios';

export default class Timer extends Model {
  /** @inheritdoc */
  static get className() {
    return 'timer';
  }

  /** @inheritdoc */
  _initProperties() {
    super._initProperties();

    this.game = null;
    this.creator = null;
    this.initial_duration = null;
    this.reload_increment = null;
    this.current_player = null;
    this.player_timers = [];
  }

  /**
   * @return {Timer[]} Timers
   */
  static async getCurrentUserTimers() {
    let {data} = await axios.get('timers');
    let processedCollection = [];
    data.forEach(elem => {
      let model = new this(elem);
      processedCollection.push(model);
    });
    return processedCollection;
  }

}
