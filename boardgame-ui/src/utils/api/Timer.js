import Model from './Model';
import axios from 'axios';
import moment from 'moment-timezone';

/** Enum providing the different timer  types */
export const TimerTypes = Object.freeze({
  COUNT_UP: 'COUNT_UP',
  COUNT_DOWN: 'COUNT_DOWN',
  RELOAD: 'RELOAD'
});

export default class Timer extends Model {
  /** @inheritdoc */
  static get className() {
    return 'timer';
  }

  /** @inheritdoc */
  _initProperties() {
    super._initProperties();

    this.id_board_game = null;
    this.id_event = null;
    this.board_game = null;
    this.event = null;
    this.creator = null;
    this.initial_duration = null;
    this.reload_increment = null;
    this.current_player = null;
    this.player_timers = [];
    this.timer_type = null;
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

  getTotalElapsed() {
    return this.player_timers.map(p => this.getPlayerElapsed(p)).reduce((a, b) => a + b, 0);
  }

  getPlayerElapsed(player_timer) {
    const start = player_timer.start;
    /**
     * If necessary, can be improved: recorded start time (server time) is diff-ed with the current browser time
     * which might cause a difference if server and browser do not have the same time.
     */
    let total_elapsed;
    const since_start = start !== null ? moment().utc().diff(moment(start)) : 0;
    const elapsed = moment.duration(player_timer.elapsed).add(since_start);
    if (this.timer_type === TimerTypes.COUNT_UP) {
      total_elapsed = elapsed;
    }
    else {
      total_elapsed = moment.duration(this.timer.initial_duration).subtract(elapsed);
      if (total_elapsed.milliseconds() < 0) {
        total_elapsed = moment.duration(0);
      }
    }
    return total_elapsed;
  }

}
