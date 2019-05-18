<template>
  <div>
    <hero-title-page-layout :title="$t('wish-list.title')"></hero-title-page-layout>
    <div class="container">
      <b-loading :is-full-page="false" :active="loading"></b-loading>
      <div class="section" v-if="!loading">
        <board-game-list :board-games="boardGames" :allBelongToUser="true"
          @add="addBoardGame" @delete="deleteBoardGame">
        </board-game-list>
      </div>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import BoardGameList from '@/components/board_games/BoardGameList';
import WishList from '@/utils/api/WishList';

export default {
  components: {
    HeroTitlePageLayout,
    BoardGameList
  },
  data() {
    return {
      loading: true,
      wishListBoardGames: null,
      wishList: new WishList()
    };
  },
  computed: {
    boardGames() {
      return this.wishListBoardGames.map(item => item.board_game);
    }
  },
  methods: {
    async addBoardGame({bggId}) {
      try {
        this.wishListBoardGames = await this.wishList.addBoardGameFromBgg(bggId);
        this.$toast.open({
          message: this.$t('wish-list.toast.add-success'),
          type: 'is-success',
          position: 'is-bottom'
        });
      }
      catch(error) {
        console.log(error);
        this.$toast.open({
          message: this.$t('wish-list.toast.add-error'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }
    },
    async deleteBoardGame(id) {
      try {
        this.wishListBoardGames = await this.wishList.removeBoardGames([id]);
        this.$toast.open({
          message: this.$t('wish-list.toast.delete-success'),
          type: 'is-success',
          position: 'is-bottom'
        });
      }
      catch(error) {
        console.log(error);
        this.$toast.open({
          message: this.$t('wish-list.toast.delete-error'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }
    }
  },
  async created() {
    this.wishListBoardGames = await this.wishList.fetchBoardGames();
    this.loading = false;
  }
};
</script>
