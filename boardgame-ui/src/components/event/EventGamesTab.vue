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
          <PanelListElement
            v-for="(game, index) in reverseSortedGames"
            v-bind:key="index">

            <template v-slot:title>
              <div class="games-headers">
                <div class="is-size-6-mobile">{{game.board_game.name}}</div>
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
                      <span class="tag is-light"><BgcDuration :duration="game.duration" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-slot:img>
              <figure class="image is-64x64 is-rounded background" :style="{backgroundImage: `url('${game.board_game.thumbnail}')`}"></figure>
            </template>

            <template v-slot:content>
              <div>
                <RankingTable
                :rankingMethod="game.ranking_method"
                :data="formattedRanking(game)"></RankingTable>
              </div>
            </template>

            <template v-if="event.current.can_write" v-slot:buttons>
              <router-link :to="{name: 'edit-game-event', params: {idGame: game.id}}" class="card-footer-item">
                <span class="icon"><i class="far fa-edit"></i></span>
                {{$t('event.games.edit')}}
              </router-link>
              <a class="card-footer-item card-footer-item-danger" @click="confirmDeleteGame(game)">
                <span class="icon"><i class="far fa-trash-alt"></i></span>
                {{$t('event.games.delete')}}
              </a>
            </template>

            <template v-slot:footer>
              <span class="has-text-weight-light has-text-dark is-size-7 time-footer">
                <time :datetime="game.createdAt">{{formatDatetime(game.createdAt)}}</time>
                </span>
            </template>

          </PanelListElement>
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
import PanelListElement from '@/components/layout/PanelListElement';
import RankingTable from '@/components/layout/RankingTable';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';
import BgcDuration from '@/components/utils/BgcDuration';

import Game from '@/utils/api/Game';
import * as Helper from '@/utils/helper';

import moment from 'moment-timezone';

export default {
  props: {
    event: Object
  },

  components: {
    PanelList,
    PanelListElement,
    RankingTable,
    ConfirmDeleteModal,
    BgcDuration
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
      if(!this.games || this.games.length == 0) {
        return [];
      }

      return this.games.slice().sort((a, b) => {
        const datetimeA = moment(a.createdAt).tz(moment.tz.guess());
        const datetimeB = moment(b.createdAt).tz(moment.tz.guess());
        console.log(datetimeA);
        console.log(datetimeB);
        
        if (datetimeA.isSameOrBefore(datetimeB)) {
          return -1;
        }
        else {
          return 1;
        }
      });
    },
    reverseSortedGames: function() {
      return this.sortedGames.reverse();
    }
  },

  methods: {
    formatDatetime: (datetime) => Helper.formatDatetime(datetime),

    formattedRanking: function(game) {
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
          // score, player
          data.push({
            'position': i+1,
            'player': name,
            'score': score,
          });
        }
      }
      return data;
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
      this.games.sort((g1, g2) => {
        return moment(g1.createdAt).diff(moment(g2.createdAt));
      });
      this.loading = false;
    }
  },

  async created() {
    this.reload();
  },

};
</script>

<style scoped>
.card-footer-item-danger {
  color: hsl(348, 100%, 61%);
}

.time-footer {
  margin-left: 10px;
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

</style>
