<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <b-message v-if="games.length === 0" type="is-info" has-icon icon-size="is-small">
        {{$t('event.games.info-message')}}
      </b-message>
      <div class="columns">
        <div class="column is-full">
          <p v-if="event.current.can_write" class="has-text-right limited-width">
            <router-link :to="{name: 'add-game-event'}" class="button is-primary">
              {{$t('button.add-game')}}
            </router-link>
          </p>

          <p class="has-text-centered has-text-grey" v-if="games.length === 0">
            {{$t('event.games.no-games')}}
          </p>

          <games-list v-if="games" :games="games" :canEdit="event.current.can_write" @gameDeleted="reload"/>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import GamesList from '@/components/games/GamesList';

export default {
  props: {
    event: Object
  },

  components: {
    GamesList
  },

  data() {
    return {
      loading: true,
      games: []
    };
  },

  methods: {
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
