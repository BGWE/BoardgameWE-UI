import axios from 'axios';

export default class WishList {
  /**
   * @param {Number} [userId]    The ID of the user whose wish list is targetted (set to null to work on list of connected user)
   */
  constructor(userId=null) {
    this.userId = userId;
  }

  /**
   * Get all games in the wish list
   * @return {Array<{id_user: Number, id_board_game: Number, board_game: Object}>} The board games belonging to the wish list
   */
  async fetchBoardGames() {
    let {data} = await axios.get(this.uri);
    return data;
  }

  /**
   * Add BGG game to the wish list (only allowed if wish list belongs to current user)
   * @param {Number} bggId The BGG identifier of the game to add
   * @return {Array<{id_user: Number, id_board_game: Number, board_game: Object}>} The board games of the wish list
   */
  async addBoardGameFromBgg(bggId) {
    if(this.userId != null) {
      throw new Error('Cannot add games in another user wish list');
    }
    let {data} = await axios.post(`user/wish_to_play/bgg/${bggId}`);
    return data;
  }

  /**
   * Add board games to the wish list (only allowed if wish list belongs to current user)
   * @param {Array<Number>} boardGamesIds The identifiers of the board games to add
   * @return {Array<{id_user: Number, id_board_game: Number, board_game: Object}>} The games of the wish list
   */
  async addBoardGames(boardGamesIds) {
    if(this.userId != null) {
      throw new Error('Cannot add games in another user wish list');
    }
    let {data} = await axios.post(this.uri, {board_games: boardGamesIds});
    return data;
  }

  /**
   * Remove games from the wish list (only allowed if wish list belongs to current user)
   * @param {Array<Number>} boardGamesIds The identifiers of the board games to remove
   * @return {Array<{id_user: Number, id_board_game: Number, board_game: Object}>} The games of the wish list
   */
  async removeBoardGames(boardGamesIds) {
    if(this.userId != null) {
      throw new Error('Cannot remove games from another user wish list');
    }
    let {data} = await axios.delete(this.uri, {data: {board_games: boardGamesIds}});
    return data;
  }

  get uri() {
    if(this.userId != null) {
      return `user/${this.userId}/wish_to_play`;
    }
    else {
      return 'user/wish_to_play';
    }
  }
}
