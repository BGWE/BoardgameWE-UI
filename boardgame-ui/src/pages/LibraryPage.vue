<template>
  <div class="wrapper">
    <hero-title-page-layout :title="$t('library.title')"></hero-title-page-layout>
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <div class="section" v-if="!loading">
      <board-game-list :board-games="boardGames" :allBelongToUser="true"
        @add="addBoardGame" @delete="deleteBoardGame">
      </board-game-list>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import BoardGameList from '@/components/board_games/BoardGameList';
import Library from '@/utils/api/Library';

export default {
  components: {
    HeroTitlePageLayout,
    BoardGameList
  },
  data() {
    return {
      loading: true,
      libraryBoardGames: null,
      library: new Library()
    };
  },
  computed: {
    boardGames() {
      return this.libraryBoardGames.map(item => item.board_game);
    }
  },
  methods: {
    async addBoardGame(id) {
      this.libraryBoardGames = await this.library.addGameFromBgg(id);
    },
    async deleteBoardGame(id) {
      this.libraryBoardGames = await this.library.removeGames([id]);
    }
  },
  async created() {
    this.libraryBoardGames = await this.library.fetchGames();
    this.loading = false;
  }
};
</script>
