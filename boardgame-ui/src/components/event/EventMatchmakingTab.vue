<template>
  <div>
    <b-loading :active="!matchmakings" :is-full-page="false" />
    <b-message type="is-info" has-icon icon-size="is-small">
      {{$t('matchmaking.info-message')}}
    </b-message>
    <template v-if="matchmakings">
      <div class="has-text-centered has-text-grey has-margin-top" v-if="matchmakings.length === 0">
        {{$t('matchmaking.no-result')}}
      </div>

      <div class="columns is-multiline">
        <div class="column is-half" v-for="{board_game, users} in matchmakings" :key="board_game.id">
          <div class="card">
            <div class="card-content">
              <div class="columns is-mobile">
                <div class="column is-narrow">
                  <figure class="image background is-80x80 is-rounded" :style="{backgroundImage: `url('${board_game.thumbnail}')`}"></figure>
                </div>
                <div class="column">
                  <div class="level">
                    <div class="level-left">
                      <p>
                        <router-link :to="{name: 'board-game', params: {id: board_game.id}}">{{board_game.name}}</router-link>
                      </p>
                    </div>
                    <div class="level-right">
                      <button
                        class="button is-small is-primary"
                        @click="isPlayed(board_game)">
                        {{$t('matchmaking.played')}}
                      </button>
                    </div>
                  </div>
                  <hr>
                  <p>
                    <span class="list-others">{{$t('matchmaking.other-attendees')}}:</span>
                    <span v-for="(user, idx) in users" :key="user.id">
                      {{user.name}} {{user.surname[0]}}.<span v-if="idx < users.length - 1">, </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-if="wishedByOthers && wishedByOthers.length">
        <hr>
        <h2 class="subtitle">{{$t('matchmaking.some-games-other-attendees-want-to-play')}}</h2>
        <div class="columns other-wishes is-mobile">
          <div class="column" v-for="wish in wishedByOthers" :key="wish.id_board_game">
            <board-game-preview class="is-small" :boardGame="wish.board_game" :wishCount="wish.count" />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import BoardGamePreview from '@/components/board_games/BoardGamePreview';
import WishList from '@/utils/api/WishList';

export default {
  props: {
    event: Object
  },
  components: {
    BoardGamePreview
  },
  data() {
    return {
      matchmakings: null,
      wishedByOthers: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  async created() {
    await this.fetchMatchmaking();
    await this.fetchWishedByOthers();
  },
  methods: {
    async fetchMatchmaking() {
      this.matchmakings = await this.event.fetchMatchmaking();
    },
    async fetchWishedByOthers() {
      let wishes = await this.event.fetchWishedBoardGames({exclude_current: true, provided_games_only: true});
      let bgIdsMatchmakings = this.matchmakings.map(elem => elem.board_game.id);
      this.wishedByOthers = wishes.filter(wish => !bgIdsMatchmakings.includes(wish.id_board_game)); // display only games not present in matchmakings
    },
    async isPlayed(board_game) {
      let wishlist = new WishList();
      await wishlist.removeBoardGames([board_game.id]);
      await this.fetchMatchmaking();
      await this.fetchWishedByOthers();
    }
  }
};
</script>

<style scoped>
.list-others {
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.7em;
  color: rgba(0,0,0,0.5);
}

.other-wishes {
  max-width: 100%;
  overflow: auto;
}

.other-wishes .column {
  max-width: 8em;
  min-width: 8em;
}

.card hr {
  margin-top: 0.2em;
  margin-bottom: 0.5em;
}

.card {
  height: 100%;
}
</style>
