<template>
  <div class="tabwrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <div class="columns" v-if="!loading">
      <div class="column is-full">
        <PanelList>
          <PanelListElement
            v-for="(game, index) in games"
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
                      <span class="tag is-light">{{game.duration}} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-slot:img>
              <figure class="image is-64x64 is-rounded" :style="{backgroundImage: `url('${game.board_game.image}')`}"></figure>
            </template>

            <template v-slot:content>
              <div>
                <RankingTable 
                :rankingMethod="game.ranking_method"
                :data="formattedRanking(game)"></RankingTable>
              </div>
            </template>

            <template v-slot:buttons>
              <a class="card-footer-item">
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
      :content="$t('event.games.confirmGameDeletion')"/>
    <!-- <b-modal :active="isConfirmDeleteModalActive" scroll="keep" :has-modal-card="true" :canCancel="true" :onCancel="onCancelConfirmDeleteModal">
        <div class="card">
            <div class="card-content">
              <div class="content">
                {{$t('event.games.confirmGameDeletion')}}
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item" @click="onCancelConfirmDeleteModal">{{$t('event.games.cancel')}}</a>
              <a href="#" class="card-footer-item card-footer-item-danger" @click="deleteGame(game)">
                <span class="icon"><i class="far fa-trash-alt"></i></span>
                {{$t('event.games.delete')}}
              </a>
            </footer>
        </div>
    </b-modal> -->
  </div>
</template>

<script>
import PanelList from '@/components/layout/PanelList';
import PanelListElement from '@/components/layout/PanelListElement';
import RankingTable from '@/components/layout/RankingTable';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';

import Event from '@/utils/api/Event';
import Game from '@/utils/api/Game';
import * as Helper from '@/utils/helper';

export default {
  components: {
    PanelList,
    PanelListElement,
    RankingTable,
    ConfirmDeleteModal
  },

  props: ['event'],

  data() {
    return {
      loading: true,
      isConfirmDeleteModalActive: false,
      gameToDelete: null,
      games: []
    }
  },

  methods: {
    formatDatetime: (datetime) => Helper.formatDatetime(datetime),

    formattedRanking: function(game) {
      let players = game.players;
      let data = [];

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const name = `${player.user.name} ${player.user.surname}`;
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
      await Game.deleteGame(this.gameToDelete.id);
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

</style>
