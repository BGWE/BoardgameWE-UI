<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <div class="columns" v-if="!loading">
      <div class="column is-full">
        <p v-if="event.current.can_write" class="has-text-right limited-width">
          <router-link :to="{name: 'add-game-event'}" class="button is-primary">
            {{$t('button.add-game')}}
          </router-link>
        </p>
        <p class="has-text-centered has-text-grey" v-if="games.length === 0">
          {{$t('event.games.no-games')}}
        </p>
        <PanelList>
          <GameCard
            v-for="(game, index) in reverseSortedGames"
            v-bind:key="index"
            :game="game"/>
        </PanelList>
      </div>
    </div>

    <ConfirmDeleteModal
      :active="isConfirmDeleteModalActive"
      :onDelete="deleteGame"
      :onCancel="onCancelConfirmDeleteModal"
      :content="$t('event.games.confirm-game-deletion')"/>
  </div>
</template>

<script>
import PanelList from '@/components/layout/PanelList';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';
import GameCard from '@/components/games/GameCard';

import Game from '@/utils/api/Game';

import moment from 'moment-timezone';

export default {
  props: {
    event: Object
  },

  components: {
    PanelList,
    ConfirmDeleteModal,
    GameCard
  },

  data() {
    return {
      loading: true,
      isConfirmDeleteModalActive: false,
      gameToDelete: null,
      games: []
    };
  },

  computed: {
    sortedGames: function() {
      if (!this.games || this.games.length == 0) {
        return [];
      }

      return this.games.slice().sort(this.sortByCreationDate);
    },

    reverseSortedGames: function() {
      return this.sortedGames.slice().reverse();
    }
  },

  methods: {
    sortByCreationDate: (g1, g2) => {
      return moment(g1.createdAt).diff(moment(g2.createdAt));
    },

    confirmDeleteGame: function(game) {
      this.gameToDelete = game;
      this.isConfirmDeleteModalActive = true;
    },

    onCancelConfirmDeleteModal: function() {
      this.isConfirmDeleteModalActive = false;
      this.gameToDelete = null;
    },

    async deleteGame() {
      try {
        await Game.delete(this.gameToDelete.id);
        this.$toast.open({
          message: this.$t('event.games.delete-game-success'),
          type: 'is-success',
          position: 'is-bottom'
        });
      }
      catch(error) {
        console.log(error);
        this.$toast.open({
          message: this.$t('event.games.delete-game-error'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }

      this.onCancelConfirmDeleteModal();
      this.reload();
    },

    async reload() {
      this.loading = true;
      this.games = await this.event.fetchGames();
      this.loading = false;
    }
  },

  async created() {
    this.reload();
  },

};
</script>

<style scoped>
.limited-width {
  max-width: 500px;
  margin: auto;
  margin-bottom: 1em;
}
</style>
