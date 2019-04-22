<template>
  <div class="tabwrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <template v-if="!loading">
      <board-game-list :board-games="boardGames" :addFromLibrary="true"
        @add="addBoardGame" @delete="deleteBoardGame">
      </board-game-list>
    </template>
  </div>
</template>

<script>
import BoardGameList from '@/components/board_games/BoardGameList';

export default {
  props: ['event'],
  components: {BoardGameList},
  data() {
    return {
      loading: true,
      boardGamesLinks: []
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    boardGames() { // remove duplicate board games and check whether or not one of the copies belongs to current user
      let mapping = {};
      let boardGames = [];
      for(let link of this.boardGamesLinks) {
        let belongsToUser = link.id_user === this.currentUser.id;
        let id = link.id_board_game;
        if(id in mapping) {
          let bg = boardGames[mapping[id]];
          bg.count++;
          if(belongsToUser) {
            bg.belongsToUser = true;
          }
        }
        else {
          boardGames.push({belongsToUser, count: 1, ...link.provided_board_game});
          mapping[id] = boardGames.length - 1;
        }
      }
      return boardGames;
    }
  },
  methods: {
    async addBoardGame(id) {
      this.boardGamesLinks = await this.event.addBoardGameFromBgg(id);
    },
    async deleteBoardGame(id) {
      await this.event.removeBoardGames([id]);
      this.boardGamesLinks = await this.event.fetchBoardGames();
    }
  },
  async created() {
    this.boardGamesLinks = await this.event.fetchBoardGames();
    this.loading = false;
  }
};
</script>

<style scoped>
</style>
