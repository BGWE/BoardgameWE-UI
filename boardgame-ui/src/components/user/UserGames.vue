<template>
  <div>
    <b-loading :is-full-page="false" :active="loading"/>
    <template v-if="!loading">
      <div v-if="isCurrentUserProfile" class="columns">
        <div class="column has-text-right">
          <router-link tag="button" class="button is-primary" :to="{name: 'add-game'}">
            {{$t("games.add")}}
          </router-link>
        </div>
      </div>

      <p class="has-text-centered has-text-grey" v-if="games.length === 0">
        {{$t('event.games.no-games')}}
      </p>

      <games-list v-if="games"
        :games="games"
        :canEdit="isCurrentUserProfile"
        @gameDeleted="reload()"
      />

    </template>
  </div>
</template>

<script>
import User from '@/utils/api/User';
import GamesList from '@/components/games/GamesList';

export default {
  props: {
    user: User,
    isCurrentUserProfile: Boolean
  },

  components: {
    GamesList
  },

  data() {
    return {
      games: null,
      loading: true
    };
  },

  methods: {
    async reload() {
      this.loading = true;
      this.games = await this.user.fetchGames();
      this.loading = false;
    }
  },

  async created() {
    this.reload();
  },
};
</script>
