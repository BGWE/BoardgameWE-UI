<template>
  <div>
    <b-loading :is-full-page="false" :active="loading"/>
    <template v-if="!loading">
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

      <GamesList v-if="games" :games="games"/>

    </template>
  </div>
</template>

<script>
import User from '@/utils/api/User';
import GamesList from '@/components/games/GamesList';

export default {
  components: {
    GamesList
  },

  data() {
    return {
      games: null,
      loading: true
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },

  async created() {
    this.games = await User.fetchGames(this.currentUser.id);
    this.loading = false;
  },
};
</script>
