<template>
  <div>
    <HeroTitlePageLayout :title="$t('games.title')"/>
    <section class="container">
      <b-loading :is-full-page="false" :active="isLoading"/>
      <div class="section">
        <div class="columns">
          <div class="column has-text-right">
            <router-link tag="button" class="button is-primary" :to="{name: 'add-game'}">
              {{$t("games.add")}}
            </router-link>
          </div>
        </div>
        <p class="has-text-centered has-text-grey" v-if="games.length === 0">
          {{$t('event.games.no-games')}}
        </p>
        <PanelList>
          <GameCard
            v-for="(game, index) in games"
            v-bind:key="index"
            :game="game"/>
        </PanelList>
        
        <ConfirmDeleteModal
            :active="isConfirmDeleteModalActive"
            :onDelete="deleteGame"
            :onCancel="onCancelConfirmDeleteModal"
            :content="$t('event.games.confirm-game-deletion')"/>
      </div>
    </section>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import User from '@/utils/api/User';
import PanelList from '@/components/layout/PanelList';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';
import Game from '@/utils/api/Game';
import GameCard from '@/components/games/GameCard';

import * as Helper from '@/utils/helper';
import moment from 'moment-timezone';

export default {
  components: {
    HeroTitlePageLayout,
    PanelList,
    ConfirmDeleteModal,
    GameCard
  },

  data() {
    return {
      games: null,
      isLoading: true
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },

  async created() {
    this.games = await User.fetchGames(this.currentUser.id);
    this.isLoading = false;
    console.log(this.games);
  },

  methods: {
    formatDatetime: (datetime) => Helper.formatDatetime(datetime),
    
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
    }
  }
};
</script>

<style scoped>
</style>
