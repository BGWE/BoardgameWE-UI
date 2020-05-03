<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <slot v-if="games.length === 0" name="emptyInfoMessage"></slot>

      <p class="has-text-right limited-width">
        <slot name="addButton"></slot>
      </p>

      <p class="has-text-centered has-text-grey" v-if="games.length === 0">
        {{$t('event.games.no-games')}}
      </p>

      <panel-list v-else>
        <panel-list-element v-for="game in games" :key="game.id">
          <template #title>
            <div class="games-headers">
              <div class="is-size-6-mobile"><game-link :game="game" /></div>
              <div class="games-subtitle field is-grouped is-grouped-multiline">
                <div class="control">
                  <div class="tags has-addons">
                    <span class="tag is-primary"><i class="fas fa-user"></i></span>
                    <span class="tag is-light">{{game.players.length}}</span>
                  </div>
                </div>

                <div class="control" v-if="game.duration">
                  <div class="tags has-addons">
                    <span class="tag is-primary"><i class="fas fa-stopwatch"></i></span>
                    <span class="tag is-light"><bgc-duration :duration="game.duration" /></span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #img>
            <figure class="image is-64x64 is-rounded background" :style="{backgroundImage: `url('${game.board_game.thumbnail}')`}"></figure>
          </template>

          <template #content>
            <div>
              <ranking-table
                :rankingMethod="game.ranking_method"
                :data="formattedRanking(game)"
              />
            </div>
          </template>

          <template #buttons v-if="canEdit">
            <router-link :to="{name: 'edit-game', params: {idGame: game.id}}" class="card-footer-item">
              <span class="icon"><i class="far fa-edit"></i></span>
              {{$t('global.edit')}}
            </router-link>
            <a class="card-footer-item card-footer-item-danger" @click="confirmDeleteGame(game)">
              <span class="icon"><i class="far fa-trash-alt"></i></span>
              {{$t('global.delete')}}
            </a>
          </template>

          <template #footer>
            <div class="has-text-weight-light has-text-dark is-size-7 time-footer">
              <span>
                <time :datetime="game.started_at">{{game.started_at | moment('LLL')}}</time>
              </span>
              <span class="footer-right" v-if="game.id_event != null">
                <event-link :event="{id: game.id_event}"></event-link>
              </span>
            </div>
          </template>

        </panel-list-element>
      </panel-list>

      <infinite-loading @infinite="infiniteHandler">
        <template #no-more><span></span></template>
        <template #no-results><span></span></template>
      </infinite-loading>
    </template>

    <confirm-delete-modal
      :active="isConfirmDeleteModalActive"
      :onDelete="deleteGame"
      :onCancel="onCancelConfirmDeleteModal"
      :content="$t('event.games.confirm-game-deletion')"
    />
  </div>
</template>

<script>
import RankingTable from '@/components/layout/RankingTable';
import BgcDuration from '@/components/utils/BgcDuration';
import PanelList from '@/components/layout/PanelList';
import PanelListElement from '@/components/layout/PanelListElement';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';
import GameLink from '@/components/games/GameLink';
import EventLink from '@/components/event/EventLink';
import InfiniteLoading from 'vue-infinite-loading';
import Game from '@/utils/api/Game';
import Event from '@/utils/api/Event';
import User from '@/utils/api/User';


const NB_ITEMS_PER_FETCH = 20;

export default {
  props: {
    canEdit: Boolean,
    event: Event,
    user: User
  },

  components: {
    RankingTable,
    BgcDuration,
    PanelList,
    PanelListElement,
    ConfirmDeleteModal,
    EventLink,
    GameLink,
    InfiniteLoading
  },

  data() {
    return {
      games: [],
      isConfirmDeleteModalActive: false,
      gameToDelete: null,
      loading: true,
      indexLastFetch: 0
    };
  },

  methods: {
    async fetchGames() {
      let params = {max_items: NB_ITEMS_PER_FETCH, start: this.indexLastFetch};
      let newGames;
      if(this.event) {
        newGames = await this.event.fetchGames(params);
      }
      else if(this.user) {
        newGames = await this.user.fetchGames(params);
      }
      this.games.push(...newGames);
      this.indexLastFetch += newGames.length;
      // boolean indicating whether or not the exact number of requested elements has been fetched
      return newGames.length == NB_ITEMS_PER_FETCH;
    },

    async infiniteHandler($state) {
      console.log('finite');
      let result = await this.fetchGames();
      if(result) {
        $state.loaded();
      }
      else {
        $state.complete();
      }
    },

    formattedRanking(game) {
      let players = game.players;
      let data = [];

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const name = player.user ? `${player.user.name} ${player.user.surname}` : `${player.name}`;
        const score = player.score;

        if (game.ranking_method === 'WIN_LOSE') {
          data.push({
            'player': name,
            'score': score,
          });
        }
        else {
          data.push({
            'position': player.rank,
            'player': name,
            'score': score,
          });
        }
      }
      return data;
    },

    confirmDeleteGame(game) {
      this.gameToDelete = game;
      this.isConfirmDeleteModalActive = true;
    },

    onCancelConfirmDeleteModal() {
      this.isConfirmDeleteModalActive = false;
      this.gameToDelete = null;
    },
    async deleteGame() {
      try {
        await Game.delete(this.gameToDelete.id);
        this.$buefy.toast.open({
          message: this.$t('event.games.delete-game-success'),
          type: 'is-success',
          position: 'is-bottom'
        });
      }
      catch(error) {
        console.log(error);
        this.$buefy.toast.open({
          message: this.$t('event.games.delete-game-error'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }

      this.games = this.games.filter(g => g.id !== this.gameToDelete.id);
      this.onCancelConfirmDeleteModal();
    }
  },
  async created() {
    await this.fetchGames();
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped>
.card-footer-item-danger {
  color: hsl(348, 100%, 61%);
}

.games-title {
  font-size: 1.1em;
}

.games-subtitle {
  margin-top: 0.2em;
}

.limited-width {
  max-width: 500px;
  margin: auto;
  margin-bottom: 1em;
}

.time-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
}
</style>
