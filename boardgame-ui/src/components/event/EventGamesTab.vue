<template>
  <div class="tabwrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <event-add-edit-game
      :event="event"
      :editGame="editGame"
      :id_timer="id_timer"
      v-if="gameForm"
      @addGame="savedGame"
      @editGame="savedGame"
      @close="closeGameForm"
    />
    <div class="columns" v-else-if="!loading">
      <div class="column is-full">
        <p v-if="isAttendee" class="has-text-right limited-width">
          <button class="button is-primary" @click="openGameForm(null)">{{$t('button.add-game')}}</button>
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

            <template v-if="isAttendee" v-slot:buttons>
              <a class="card-footer-item" @click="openGameForm(game)">
                <span class="icon"><i class="far fa-edit"></i></span>
                {{$t('event.games.edit')}}
              </a>
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
import EventAddEditGame from './EventAddEditGame';

import Game from '@/utils/api/Game';
import * as Helper from '@/utils/helper';

import moment from 'moment-timezone';

export default {
  props: {
    event: Object,
    isAttendee: Boolean
  },

  components: {
    PanelList,
    PanelListElement,
    RankingTable,
    ConfirmDeleteModal,
    EventAddEditGame,
    BgcDuration
  },

  data() {
    return {
      loading: true,
      isConfirmDeleteModalActive: false,
      gameToDelete: null,
      games: [],
      gameForm: false,
      editGame: null
    };
  },

  computed: {
    sortedGames: function() {
      if(!this.games || this.games.length == 0) {
        return [];
      }

      return this.games.slice().sort((a, b) => {
        const datetimeA = moment(a).tz(moment.tz.guess());
        const datetimeB = moment(b).tz(moment.tz.guess());

        return datetimeA.isSameOrBefore(datetimeB);
      });
    },

    reverseSortedGames: function() {
      return this.sortedGames.slice().reverse();
    },

    id_timer() {
      return this.$route.params.id_timer;
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

    openGameForm(game) {
      this.editGame = game;
      this.gameForm = true;
    },

    savedGame() {
      if (this.id_timer) {
        this.reloadPageWithoutTimer();
      } 
      else {
        this.reload();
        this.gameForm = false;
      }
    },

    closeGameForm() {
      if (this.id_timer) {
        this.reloadPageWithoutTimer();
      } 
      else {
        this.gameForm = false;
      }
    },

    reloadPageWithoutTimer() {
      this.$route.push({
        name: 'event-games', 
        params: {
          eventid: this.event.id
        }
      });
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
      if (this.id_timer) {
        this.openGameForm(null);
      }
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
