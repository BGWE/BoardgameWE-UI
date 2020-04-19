<template>
  <div>
    <PanelList>
      <PanelListElement v-for="(game, id) in reverseSortedGames" v-bind:key="id">
        <template v-slot:title>
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

        <template v-slot:buttons v-if="canEdit">
          <router-link :to="{name: 'edit-game', params: {idGame: game.id}}" class="card-footer-item">
            <span class="icon"><i class="far fa-edit"></i></span>
            {{$t('global.edit')}}
          </router-link>
          <a class="card-footer-item card-footer-item-danger" @click="confirmDeleteGame(game)">
            <span class="icon"><i class="far fa-trash-alt"></i></span>
            {{$t('global.delete')}}
          </a>
        </template>

        <template v-slot:footer>
          <div class="has-text-weight-light has-text-dark is-size-7 time-footer">
            <span>
              <time :datetime="game.started_at">{{game.started_at | moment('LLL')}}</time>
            </span>
            <span class="footer-right" v-if="game.id_event != null">
              <event-link :event="{id: game.id_event}"></event-link>
            </span>
          </div>
        </template>

      </PanelListElement>
    </PanelList>

    <ConfirmDeleteModal
      :active="isConfirmDeleteModalActive"
      :onDelete="deleteGame"
      :onCancel="onCancelConfirmDeleteModal"
      :content="$t('event.games.confirm-game-deletion')"/>
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
import Game from '@/utils/api/Game';
import moment from 'moment-timezone';

export default {
  props: {
    games: Array,
    canEdit: Boolean
  },

  components: {
    RankingTable,
    BgcDuration,
    PanelList,
    PanelListElement,
    ConfirmDeleteModal,
    EventLink,
    GameLink
  },

  data() {
    return {
      isConfirmDeleteModalActive: false,
      gameToDelete: null,
    };
  },

  computed: {
    sortedGames: function() {
      if (!this.games || this.games.length == 0) {
        return [];
      }

      return this.games.slice().sort(this.sortByStartDate);
    },

    reverseSortedGames: function() {
      return this.sortedGames.slice().reverse();
    }
  },

  methods: {
    sortByStartDate: (g1, g2) => {
      return moment(g1.started_at).diff(moment(g2.started_at));
    },

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
          data.push({
            'position': player.rank,
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

      this.onCancelConfirmDeleteModal();
      this.$emit('gameDeleted');
    }
  },
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
