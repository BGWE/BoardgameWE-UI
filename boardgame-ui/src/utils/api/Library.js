import axios from 'axios';

export default class Library {
  /**
   * @param {Number} [userId]    The ID of the user possessing the library (set to null to work on library of connected user)
   */
  constructor(userId=null) {
    this.userId = userId;
  }

  /**
   * Get all games in the library
   * @return {Array<{id_user: Number, id_game: Number}>} The games of the library
   */
  async fetchGames() {
    let {data} = await axios.get(this.uri);
    return data;
  }

  /**
   * Add BGG game to the library (only allowed if library belongs to current user)
   * @param {Number} bggId The BGG identifier of the game to add
   * @return {Array<{id_user: Number, id_game: Number}>} The games of the library
   */
  async addGameFromBgg(bggId) {
    if(this.userId != null) {
      throw new Error('Cannot add games in another user library');
    }
    let {data} = await axios.post(`user/current/library_game/bgg/${bggId}`);
    return data;
  }

  /**
   * Add games to the library (only allowed if library belongs to current user)
   * @param {Array<Number>} gamesIds The identifiers of the games to add
   * @return {Array<{id_user: Number, id_game: Number}>} The games of the library
   */
  async addGames(gamesIds) {
    if(this.userId != null) {
      throw new Error('Cannot add games in another user library');
    }
    let {data} = await axios.post(this.uri, {board_games: gamesIds});
    return data;
  }

  /**
   * Remove games from the library (only allowed if library belongs to current user)
   * @param {Array<Number>} gamesIds The identifiers of the games to remove
   * @return {Array<{id_user: Number, id_game: Number}>} The games of the library
   */
  async removeGames(gamesIds) {
    if(this.userId != null) {
      throw new Error('Cannot remove games from another user library');
    }
    let {data} = await axios.delete(this.uri, {data: {board_games: gamesIds}});
    return data;
  }

  get uri() {
    if(this.userId != null) {
      return `user/${this.userId}/library_games`;
    }
    else {
      return 'user/current/library_games';
    }
  }
}
