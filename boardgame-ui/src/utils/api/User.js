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
   * Fetch the games of the current user
   * @return {Object} Response from backend
   */
  static async fetchGames(userId) {
    const id = userId || this.id;
    let {data} = await axios.get(`/user/${id}/games`);
    return data;
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
   * Fetch user friends
   * @returns {Array[User]} List of friends
   */
  async fetchFriends() {
    let {data} = await axios.get(`/user/${this.id}/friends`);
    return data.map(elem => new User(elem));
  }

  /**
   * Fetch the friendship requests related to current user
   * @returns {Array[]} List of friends requests
   */
  static async fetchCurrentFriendshipRequests() {
    let {data} = await axios.get('/friend_requests');
    return data;
  }

  static async fetchCurrentSentFriendshipRequests() {
    let {data} = await axios.get('/sent_friend_requests');
    return data;
  }

  /**
   * Handle a friendship request received by current user
   * @param {Number} idSender identifier of the user that sent the friendship request
   * @param {Boolean} accept true for accepting request, false for rejecting it
   */
  static async handleFriendshipRequest(idSender, accept) {
    await axios.put('/friend_request', {id_sender: idSender, accept});
  }

  /**
   * Send a friendship request to another user
   * @param {Number} idUser identifier of the user added as friend
   */
  static async sendFriendshipRequest(idUser) {
    await axios.post('friend_request', {id_recipient: idUser});
  }

  /**
   * Cancel a friendship request
   * @param {Number} idUser identifier of the friend request recipient
   */
  static async cancelFriendshipRequest(idUser) {
    await axios.delete('friend_request', {data: {id_recipient: idUser}});
  }

  /**
   * Remove a user from friends
   * @param {Number} idUser identifier of the user to remove from friends
   */
  static async removeFriend(idUser) {
    await axios.delete(`friend/${idUser}`);
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

  static async forgotPassword(email) {
    let {data} = await axios.post('user/forgot_password', {email: email});
    return data;
  }

  static async resetPassword(token, id, password) {
    let {data} = await axios.post('user/reset_password', {token: token, id: id, password: password});
    return data;
  }

  static async fetchAchievements() {
    let {data} = await axios.get('/user/current/achievements');
    return data;
  }

  static async fetchUserAchievements(userId) {
    const id = userId || this.id;
    let {data} = await axios.get(`/user/${id}/achievements`);
    return data;
  }

  static async easterEgg() {
    let {data} = await axios.post('user/current/easteregg');
    return data;
  }

  static async fetchTotalNumberAchievements() {
    let {data} = await axios.get('/achievements/total');
    return data;
  }
}
