<template>
  <div class="wrapper">
    <h1 class="title" v-if="event">
        {{$t(idGame ? 'edit-game.title' : 'add-game.title')}}
    </h1>

    <b-loading :active="!game" :is-full-page="false" />
    <form v-if="game" @submit.prevent="save()">

      <b-field v-if="event" :label="$t('timer.add-edit.event')" >
        <b-input disabled :value="event.name" />
      </b-field>

      <b-field v-else-if="events" :label="$t('timer.add-edit.event')">
         <event-autocomplete
            v-model="selectedEvent"
            :inputData="events"
            :data-vv-as="$t('add-edit-game.event.label')"
          />
      </b-field>

      <b-field
        :label="$t('add-edit-game.board-game.label')"
        :type="{'is-danger': errors.has('boardGame')}"
        :message="errors.first('boardGame')"
      >
        <b-autocomplete
          v-model="searchString"
          :data="filteredBoardGames"
          field="name"
          icon="search"
          @select="selectBoardGame"
          name="boardGame"
          :data-vv-as="$t('add-edit-game.board-game.label')"
          v-validate="'required'"
        >
          <template slot="empty">{{$t('add-edit-game.board-game.no-result')}}</template>
        </b-autocomplete>
      </b-field>
      <div class="columns">
        <div class="column">
          <b-field :label="$t('add-edit-game.ranking-method.label')">
            <b-select v-model="game.ranking_method" expanded>
              <option v-for="method in allowedRankingMethods" :value="method" :key="method">
                {{$t('global.ranking-method.' + method)}}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column is-narrow">
          <b-field :label="$t('add-edit-game.game-duration.label')">
            <b-timepicker v-model="time" size="is-small" :min-time="minTime" :increment-minutes="15" inline />
          </b-field>
        </div>
      </div>

      <h2 class="subtitle">{{$t('add-edit-game.players.title')}}</h2>

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>{{$t('add-edit-game.players.user')}}</th>
            <th v-if="ranked">{{$t('add-edit-game.players.score')}}</th>
            <th v-else>{{$t('add-edit-game.players.winner')}}</th>
            <th class="has-text-white">.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="({id}, idx) in players" :key="id">
            <td>
              <b-field
                :type="{'is-danger': errors.has(`user-${id}`)}"
                :message="errors.first(`user-${id}`)"
              >
                <user-autocomplete
                  size="is-small"
                  v-model="players[idx].user"
                  :users="users"
                  :excludedIds="selectedUsersIds"
                  :name="`user-${id}`"
                  :data-vv-as="$t('add-edit-game.players.user')"
                  v-validate="'required'"
                />
              </b-field>
            </td>
            <td>
              <b-field
                v-if="ranked"
                :type="{'is-danger': errors.has(`score-${id}`)}"
                :message="errors.first(`score-${id}`)"
              >
                <b-input
                  v-model="players[idx].score"
                  size="is-small"
                  :name="`score-${id}`"
                  :data-vv-as="$t('add-edit-game.players.score')"
                  v-validate="'required'"
                />
              </b-field>
              <b-checkbox v-else v-model="players[idx].score" size="is-small" />
            </td>
            <td>
              <button type="button" class="delete" @click="removePlayer(idx)"></button>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="has-text-centered">
              <button class="button is-small" type="button" @click="addPlayer()">
                {{$t('button.add-player')}}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="buttons is-right">
        <button class="button" type="button" @click="$router.go(-1)">{{$t('button.cancel')}}</button>
        <button class="button is-primary">{{$t('button.save')}}</button>
      </div>
    </form>
  </div>
</template>

<script>
import Game, {GameRankingMethods} from '@/utils/api/Game';
import Timer from '@/utils/api/Timer';
import Event from '@/utils/api/Event';
import UserAutocomplete from '@/components/form/UserAutocomplete';
import EventAutocomplete from '@/components/form/EventAutocomplete';

export default {
  components: {
    UserAutocomplete,
    EventAutocomplete
  },
  props: {
    users: { // list of selectable users
      type: Array,
      required: true
    },
    boardgames: {
      type: Array,
      required: true
    },
    event: {
      type: Event,
      required: false,
      default: null
    },
    events: {
      type: Array,
      required: false,
      default: null
    }
  },
  data() {
    return {
      game: null,
      searchString: '',
      selectedEvent: null,
      time: null,
      minTime: null,
      players: [],
      idPlayer: 1
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    idGame() {
      return this.$route.params.idGame;
    },
    idTimer() {
      return this.$route.query.idTimer;
    },
    filteredBoardGames() {
      if (!this.searchString) {
        return this.boardgames;
      }

      let str = this.searchString.toLowerCase();
      return this.boardgames.filter(bg => bg.name.toLowerCase().indexOf(str) >= 0);
    },
    allowedRankingMethods() {
      return [GameRankingMethods.WIN_LOSE, GameRankingMethods.POINTS_HIGHER_BETTER];
    },
    ranked() {
      return this.game.ranking_method === GameRankingMethods.POINTS_HIGHER_BETTER;
    },
    selectedUsersIds() {
      return this.players.map(({user}) => user ? user.id : 0);
    }
  },

  watch: {
    'game.ranking_method'(_, old) {
      if(!old) {
        return;
      }
      this.players.forEach(player => player.score = null); // reinitialize scores
    },
    time() {
      if(this.time < this.minTime) {
        this.time = this.minTime;
      }
    }
  },

  methods: {
    setTimeFromDuration(duration) { // arg duration to be provided in minutes
      duration = Math.round(duration / 15) * 15; // get multiple of 15 minutes
      let time = new Date();
      time.setHours(Math.floor(duration / 60));
      time.setMinutes(duration % 60);
      this.time = time;
    },
    getDurationFromTime(time) {
      return time.getHours() * 60 + time.getMinutes();
    },
    selectBoardGame(option) {
      this.game.id_board_game = option ? option.id : null;
    },
    addPlayer() {
      this.players.push({user: null, score: null, id: this.idPlayer++});
    },
    removePlayer(idx) {
      if(this.players.length === 1) {
        this.$toast.open({
          message: this.$t('add-edit-game.must-have-at-least-one-player'),
          type: 'is-danger',
          position: 'is-bottom'
        });
        return;
      }
      this.players.splice(idx, 1);
    },

    async save() {
      let result = await this.$validator.validateAll();

      if (!this.game.id_board_game) {
        this.$validator.errors.add({field: 'boardGame', msg: this.$t('add-edit-game.validation-error.board-game')});
        result = false;
      }

      if (!result) {
        this.$toast.open({
          message: this.$t('global.invalid-form'),
          type: 'is-danger',
          position: 'is-bottom'
        });
        return;
      }
      
      if (this.selectedEvent != null) {
        this.game.id_event = this.selectedEvent.id;
      }

      this.game.duration = this.getDurationFromTime(this.time);
      this.game.players = this.players.map(({user, score}) => {
        score = Number(score);
        return typeof user === 'string' ? {name: user, score} : {id_user: user.id, score};
      });

      try {
        await this.game.save();
        this.$toast.open({
          message: this.$t('add-edit-game.save-success'),
          type: 'is-success',
          position: 'is-bottom'
        });
        this.$router.go(-1);
      }
      catch(error) {
        console.log(error);
        this.$toast.open({
          message: this.$t('add-edit-game.save-error'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }
    }
  },

  async created() {
    let minTime = new Date();
    minTime.setHours(0);
    minTime.setMinutes(15);
    this.minTime = minTime;

    if (this.idGame) {
      this.game = await Game.fetch(this.idGame);

      this.searchString = this.game.board_game.name;
      if (this.game.id_event) {
        if (this.events) {
          this.selectedEvent = this.events.find(event => event.id == this.game.id_event);
        }
        else {
          this.selectedEvent = this.event;
        }
      }
      
      this.game.players.forEach(player => {
        let score = this.ranked ? player.score : Boolean(player.score);
        this.players.push({user: player.user || player.name, score, id: this.idPlayer++});
      });

      this.setTimeFromDuration(this.game.duration);
    }
    else {
      let gameData = { ranking_method: GameRankingMethods.POINTS_HIGHER_BETTER };
      
      if (this.event) {
        gameData.id_event = this.event.id;
        this.selectedEvent = this.event;
      }
      
      if (this.idTimer) {
        gameData.id_timer = this.idTimer;

        const timer = await Timer.fetch(this.idTimer);
        this.setTimeFromDuration(timer.getTotalElapsed() / 1000 / 60);

        if (timer.board_game) {
          gameData.id_board_game = timer.id_board_game;
          this.searchString = timer.board_game.name;
        }

        timer.player_timers.forEach(player => {
          this.players.push({ user: player.user || player.name, score: null, id: this.idPlayer++ });
        });
      }
      else {
        this.setTimeFromDuration(30); // default duration: 30 minutes
        this.players.push({user: this.currentUser, score: null});
      }

      this.game = new Game(gameData);
    }

  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 600px;
  min-height: 20vh;
  margin: auto;
  position: relative;
  padding-left: 5pt;
  padding-right: 5pt;
}

h2 {
  margin-bottom: 0.5em !important;
  text-align: center;
}

/deep/ .timepicker .dropdown-content {
  padding-top: 0 !important;
  padding-bottom: 0 !important;

  select {
    font-weight: normal !important;
  }
}

/deep/ label {
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.7em;
}

th:nth-child(2), td:nth-child(2) {
  text-align: center;

  /deep/ .control {
    max-width: 10em;
    margin: auto;
  }
}
</style>
