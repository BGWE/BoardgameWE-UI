<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <b-message type="is-info" has-icon icon-size="is-small">
        {{ $t('wish-list.explanation.' + (isCurrentUserProfile ? 'current-user' : 'other-user'), {user: user.name}) }}
      </b-message>
      <board-game-list
        :boardGames="boardGames"
        :allBelongToUser="isCurrentUserProfile"
        :canAdd="isCurrentUserProfile"
        :addFromLibrary="true"
        @add="addBoardGame"
        @delete="deleteBoardGame"
      />
    </template>
  </div>
</template>

<script>
import BoardGameList from '@/components/board_games/BoardGameList';
import WishList from '@/utils/api/WishList';
import User from '@/utils/api/User';

export default {
  props: {
    user: User,
    isCurrentUserProfile: Boolean
  },
  components: {
    BoardGameList
  },
  data() {
    return {
      loading: true,
      wishList: null,
      wishListBoardGames: null
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
    this.wishList = new WishList(!this.isCurrentUserProfile ? this.user.id : null);
    this.wishListBoardGames = await this.wishList.fetchBoardGames();
    this.loading = false;
  }
};
</script>
