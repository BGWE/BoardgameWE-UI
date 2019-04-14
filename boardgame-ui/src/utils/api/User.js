import Model from './Model';
import axios from 'axios';

export default class User extends Model {
  /** @inheritdoc */
  static get className() {
    return 'user';
  }

  /** @inheritdoc */
  _initProperties() {
    super._initProperties();

    this.username = null;
    this.name = null;
    this.surname = null;
    this.email = null;
    this.password = null;
  }

  /**
   * @param {String} username
   * @param {String} password
   * @return {String} A JWT token if the authentication was performed successfully
   */
  static async login(username, password) {
    let {data} = await axios.post('user/login', {username, password});
    return data.token;
  }

  /**
   * Fetch the data of current user
   * @return {User} The current user
   */
  static async fetchCurrent() {
    let {data} = await axios.get('user/current');
    return new this(data);
  }

  /**
   * Fetch user statistics
   * @param userId (Optional) Identifier of the user (default: user identifier)
   * @returns {Object} Response from backend
   */
  static async fetchStats(userId) {
    const id = userId || this.id;
    let {data} = await axios.get(`/user/${id}/stats`);
    return data;
  }

  /**
   * Fetch user latest activities
   * @param userId (Optional) Identifier of the user (default: user identifier)
   * @returns {Object} Response from backend
   */
  static async fetchActivities(userId) {
    const id = userId || this.id;
    let {data} = await axios.get(`/user/${id}/activities`);
    return data;
  }

  /**
   * [ADMIN] Fetch the listing of users with their status
   * @return {Array} List of users and their status.
   */
  static async fetchUsers() {
    let {data} = await axios.get('admin/users');
    return data.users;
  }

  /**
   * [ADMIN] Validate or refuse
   * @param {String} idUser
   * @param {Boolean} validate
   * @return {Object} Response from backend
   */
  static async setUserValidation(idUser, validate) {
    let {data} = await axios.put('admin/user', {id_user: idUser, validated: validate});
    return data;
  }
}
