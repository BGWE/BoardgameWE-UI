import Model from './Model';
import axios from 'axios';

export default class Application extends Model {
  /** @inheritdoc */
  static get className() {
    return 'Application';
  }

  static async statistics() {
    let {data} = await axios.get('statistics');
    return data;
  }
}
