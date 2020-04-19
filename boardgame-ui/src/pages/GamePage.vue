<template>
  <div class="wrapper">
    <b-loading :is-full-page="false" :active="loading" />
    <div class="section" v-if="error">
      <b-message type="is-danger">{{$t('error.unexpected')}}</b-message>
    </div>
    <template v-else-if="!loading">
      <hero-title-page-layout :title="$t('game-page.title', {boardGame: boardGame.name})" />
      <div class="container">
        <div class="section">
          <div class="columns">
            <div class="column">
              <div class="box">
                <div class="panel-block is-size-7">
                  <span class="panel-icon">
                    <i class="fas fa-dice"></i>
                  </span>
                  <board-game-link :boardGame="boardGame" />
                </div>
                <div class="panel-block is-size-7" v-if="event">
                  <span class="panel-icon">
                    <i class="fas fa-calendar-week"></i>
                  </span>
                  <event-link :event="event" />
                </div>
                <div class="panel-block is-size-7">
                  <span class="panel-icon">
                    <i class="fas fa-calendar-day"></i>
                  </span>
                  {{game.started_at | moment('lll')}}
                </div>
                <div class="panel-block is-size-7">
                  <span class="panel-icon">
                    <i class="fas fa-stopwatch"></i>
                  </span>
                  <bgc-duration :duration="game.duration" />
                </div>
                <div class="panel-block is-size-7" v-if="game.comment">
                  <span class="panel-icon">
                    <i class="fas fa-comment"></i>
                  </span>
                  {{game.comment}}
                </div>

                <b-table
                  :data="players"
                  :row-class="rowClass"
                >
                  <template #default="{row: player}">
                    <b-table-column :visible="ranked" :label="$t('game-page.rankings.table.position')">
                      <span class="tag" :class="rankClass(player.rank)">{{ player.rank }}</span>
                    </b-table-column>

                    <b-table-column :label="$t('game-page.rankings.table.player')">
                      <user-link v-if="player.user" :user="player.user" />
                      <span v-else>{{player.name}}</span>
                    </b-table-column>

                    <b-table-column :visible="ranked" :label="$t('game-page.rankings.table.score')">
                      {{ player.score }}
                    </b-table-column>

                    <b-table-column :visible="!ranked" :label="$t('game-page.rankings.table.win')">
                      <div v-if="player.score == 1" class="tag has-background-gold has-text-white is-26x26">
                        <i class="fas fa-trophy"></i>
                      </div>
                    </b-table-column>

                    <b-table-column :visible="timer != null" :label="$t('game-page.rankings.table.play-time')">
                      <bgc-duration v-if="player.elapsed != null" :duration="player.elapsed" />
                      <span class="unknown-time has-text-grey" v-else>{{$t('label.unknown')}}</span>
                    </b-table-column>
                  </template>
                </b-table>

                <div v-if="canEdit" class="buttons is-centered">
                  <router-link :to="{name: 'edit-game', params: {idGame: idGame}}" class="button is-info is-outlined">
                    <span class="icon is-small"><i class="far fa-edit"></i></span>
                    <span>{{$t('global.edit')}}</span>
                  </router-link>
                  <a class="button is-danger is-outlined" @click="isDeleteModalActive = true">
                    <span class="icon"><i class="far fa-trash-alt"></i></span>
                    <span>{{$t('global.delete')}}</span>
                  </a>
                </div>
              </div>
            </div>
            <div class="column is-one-third about-board-game">
              <div class="box">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <figure
                      class="image is-64x64 is-rounded background"
                      :style="{backgroundImage: `url('${boardGame.thumbnail}')`}"
                    >
                    </figure>
                  </div>
                  <div class="column">
                    <h2 class="subtitle">
                      <router-link :to="{name: 'board-game', params: {id: boardGame.id}}">{{boardGame.name}}</router-link>
                    </h2>
                    <p v-html="description"></p>
                  </div>
                </div>
                <router-link class="button is-fullwidth" :to="{name: 'board-game', params: {id: boardGame.id}}">
                  {{$t('game-page.board-game.more-info-button')}}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <confirm-delete-modal
        :active="isDeleteModalActive"
        :onDelete="deleteGame"
        :onCancel="() => isDeleteModalActive = false"
        :content="$t('event.games.confirm-game-deletion')"
      />
    </template>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import BgcDuration from '@/components/utils/BgcDuration';
import UserLink from '@/components/user/UserLink';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';
import BoardGameLink from '@/components/board_games/BoardGameLink';
import EventLink from '@/components/event/EventLink';
import Game from '@/utils/api/Game';
import Timer from '@/utils/api/Timer';
import Event from '@/utils/api/Event';

const MAX_LENGTH_DESC = 200;

export default {
  components: {
    HeroTitlePageLayout,
    BgcDuration,
    UserLink,
    ConfirmDeleteModal,
    BoardGameLink,
    EventLink
  },
  data() {
    return {
      game: null,
      timer: null,
      event: null,
      loading: true,
      error: false,
      isDeleteModalActive: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    idGame() {
      return this.$route.params.id;
    },
    boardGame() {
      return this.game.board_game;
    },
    description() {
      let desc = this.boardGame.description;
      if(!desc) {
        return this.$t('no-description');
      }
      if(desc.length < MAX_LENGTH_DESC) {
        return desc;
      }
      return desc.substring(0, MAX_LENGTH_DESC) + '...';
    },
    ranked() {
      return this.game.ranking_method !== 'WIN_LOSE';
    },
    players() {
      let players = this.game.players;
      if(this.timer) {
        let elapsedByPlayerId = {};
        let elapsedByPlayerName = {};
        for(let timerPlayer of this.timer.player_timers) {
          if(timerPlayer.id_user) {
            elapsedByPlayerId[timerPlayer.id_user] = timerPlayer.elapsed / 60000;
          }
          else {
            elapsedByPlayerName[timerPlayer.name] = timerPlayer.elapsed / 60000;
          }
        }
        for(let player of players) {
          if(player.id_user) {
            player.elapsed = elapsedByPlayerId[player.id_user];
          }
          else {
            player.elapsed = elapsedByPlayerName[player.name];
          }
        }
      }
      return players;
    },
    canEdit() {
      for(let player of this.game.players) {
        if(player.id_user == this.currentUser.id) {
          return true;
        }
      }
      return false; // cannot edit if not one of the players
    }
  },
  watch: {
    idGame() {
      this.loadGame();
    }
  },
  methods: {
    async loadGame() {
      this.loading = true;
      this.error = false;
      this.timer = null;
      this.event = null;
      try {
        this.game = await Game.fetch(this.idGame);

        if(this.game.id_timer) {
          try {
            this.timer = await Timer.fetch(this.game.id_timer);
          }
          catch(error) {
            console.log(error);
          }
        }

        if(this.game.id_event) {
          try {
            this.event = await Event.fetch(this.game.id_event);
          }
          catch(error) {
            console.log(error);
          }
        }
      }
      catch(error) {
        console.log(error);
        this.error = true;
      }

      this.loading = false;
    },
    rowClass(row) {
      if((this.ranked && row.rank <= 3) || (!this.ranked && row.score == 1)) {
        return 'has-text-weight-semibold has-background-light';
      }
    },
    rankClass(rank) {
      if(rank > 3) {
        return;
      }

      let winnerClass = '';
      if(rank == 1) {
        winnerClass = 'has-background-gold';
      }
      else if(rank == 2) {
        winnerClass = 'has-background-silver';
      }
      else if(rank == 3) {
        winnerClass = 'has-background-bronze';
      }
      return winnerClass + ' has-text-white';
    },
    async deleteGame() {
      try {
        await this.game.delete();
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

      this.$router.go(-1);
    }
  },
  async created() {
    this.loadGame();
  }
};
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 0.5em;
}

hr {
  margin-bottom: 0;
}

.level {
  justify-content: center;
}

.level-item {
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.buttons {
  margin-top: 1em;
}

.unknown-time {
  font-weight: normal;
}

.panel-block {
  margin: 0 -1.25rem;
  border-left: 0;
  border-right: 0;
  padding: 0.6em 1.5rem;

  &:first-of-type {
    border-top: 0;
    margin-top: -1rem;
  }
}

/deep/ .b-table {
  margin-top: 1em;
}
</style>
