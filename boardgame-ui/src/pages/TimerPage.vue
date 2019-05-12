<template>
  <section v-if=timer>
    <b-loading :is-full-page="true" :active="isLoading" :can-cancel="true"></b-loading>
    <!-- <div>
      <b-field grouped group-multiline>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">Timer</b-tag>
            <b-tag type="is-info">
              <i18n v-bind:path="timerTypeI18nPath"/>
            </b-tag>
          </b-taglist>
        </div>
      </b-field>
    </div> -->


    <div class="has-text-centered row-buttons">
      <a class="button timer-button"
        v-on:click="isRunning ? stop() : start()"
        :class="isRunning ? 'timer-button-active' : ''">
        <span>
          <i class="fas" :class="isRunning ? 'fa-pause' : 'fa-play'"></i>
        </span>
      </a>
      <a
        class="button timer-button"
        v-on:click="prev"><span><i class="fas fa-arrow-left"></i></span>
      </a>
      <a
        class="button timer-button"
        v-on:click="next"><span><i class="fas fa-arrow-right"></i></span>
      </a>
    </div>


    <!-- <article class="box" v-bind:style="{['background-color']: currentPlayer.color}">
      <p >{{currentPlayerName}}</p>
    </article> -->

    <div>
      <draggable
        :list="players"
        :disabled="isRunning"
        @start="dragging = true"
        @end="dragging = false">

        <transition-group type="transition" name="flip-list">

        <player-timer
          class="card"
          v-for="(player_timer, key) in players"
          :key="player_timer.id"
          :player_timer="player_timer"
          :timer="timer"
          :is_selected="key === timer.current_player"
          :is_running="isRunning"
          v-bind:class="{'timer-button-first' : key === timer.current_player}" />

        </transition-group>

      </draggable>
    </div>
  </section>
</template>

<script>
import Timer, { TimerTypes } from '@/utils/api/Timer';
import PlayerTimer from '@/components/timer/PlayerTimer';

import draggable from 'vuedraggable';

export default {
  name: 'TimerPage',
  components: {PlayerTimer, draggable},
  data() {
    return {
      timer: null,
      isLoading: false,
      isRunning: false,
      dragging: false,
      players: [],
    };
  },
  computed: {
    timerTypeI18nPath() {
      return {
        [TimerTypes.COUNT_UP]: 'timer.type.count_up',
        [TimerTypes.COUNT_DOWN]: 'timer.type.count_down',
        [TimerTypes.RELOAD]: 'timer.type.reload'
      }[this.timer.timer_type];
    },
    currentPlayer: function() {
      return this.players[this.timer.current_player];
    },
    currentPlayerName: function() {
      let currentPlayer = this.currentPlayer;
      return currentPlayer.user === null ? currentPlayer.name : currentPlayer.user.name;
    },
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  sockets: {
    connect() {
      console.log('connect');
    },
    timer_start(timer) {
      this.setTimer(timer);
    },
    timer_stop(timer) {
      this.setTimer(timer);
    },
    timer_next(timer) {
      this.setTimer(timer);
    },
    timer_prev(timer) {
      this.setTimer(timer);
    },
    change_player_turn_order(timer) {
      this.isLoading = false;
      this.setTimer(timer);
    },
    error(error) {
      console.log(error);
    }
  },
  watch: {
    players: function(val) {
      if (!this.arePlayersOrderedListEqual(val, this.turnPlayerTimers())) {
        // Order changed
        for (let i = 0; i < val.length; i++) {
          const player = val[i];
          player.turn_order = i;
        }

        this.isLoading = true;
        this.$socket.emit('change_player_turn_order', val);
      }
    },
  },
  async created() {
    this.setTimer(await Timer.fetch(this.$route.params.timerid));
    this.follow();
  },
  beforeDestroy() {
    this.unfollow();
    this.timer = null;
  },
  methods: {
    setTimer(timer) {
      this.timer = timer;
      this.players = this.turnPlayerTimers();
      this.isRunning = this.players.some((p => p.start !== null));

      if (this.timer.player_timers.some(p => p.id_user === this.currentUser.id && p.start !== null)) {
        this.$notification.open({
          message: this.$t('timer.your_turn'),
          type: 'is-success'
        });
      }
    },
    start() {
      this.$socket.emit('timer_start');
    },
    stop() {
      this.$socket.emit('timer_stop');
    },
    next() {
      this.$socket.emit('timer_next');
    },
    prev() {
      this.$socket.emit('timer_prev');
    },
    follow() {
      this.$socket.emit('timer_follow', this.timer.id);
    },
    unfollow() {
      this.$socket.emit('timer_unfollow');
    },
    turnPlayerTimers() {
      let player_timers = this.timer.player_timers.slice(0);
      player_timers.sort((p1, p2) => p1.turn_order - p2.turn_order);
      return player_timers;
    },
    arePlayersOrderedListEqual(l1, l2) {
      if (l1.length !== l2.length) {
        return false;
      }
      for (let i = 0; i < l1.length; i++) {
        const timerPlayer1 = l1[i];
        const timerPlayer2 = l2[i];

        if (timerPlayer1.turn_order !== timerPlayer2.turn_order) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style scoped>
.button {
  margin-right: 3px;
}

.card {
  margin-bottom: 5px;
}

.row-buttons {
  margin: 1em;
}

.timer-button {
  border-radius: 50%;
  min-width: 4em;
  min-height: 4em;
  width: 5em;
  height: 5em;
  margin: 0.5em;
}

.timer-button:active {
  color: grey;
  border-color: grey;
}

.timer-button-active {
  color: hsl(204, 86%, 53%);
  border-color: hsl(204, 86%, 53%);
}

.timer-button span{
  font-size: 1.5em;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
