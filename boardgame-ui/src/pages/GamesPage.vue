<template>
  <div>
    <HeroTitlePageLayout :title="$t('games.title')"/>
    <section class="container">
      <b-loading :is-full-page="false" :active="loading"/>
      <template v-if="!loading">
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

          <GamesList v-if="games" :games="reverseSortedGames"/>
          
        </div>
      </template>
    </section>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import User from '@/utils/api/User';
import GamesList from '@/components/games/GamesList';
import moment from 'moment-timezone';

export default {
  components: {
    HeroTitlePageLayout,
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
    },

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
  },

  async created() {
    this.games = await User.fetchGames(this.currentUser.id);
    this.loading = false;
  },
};
</script>
