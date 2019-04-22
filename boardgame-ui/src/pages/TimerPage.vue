<template>
  <section v-if=timer>
    <div class="section timer_buttons">
      <button class="button" v-on:click="start"><span><i class="fas fa-play"></i></span></button>
      <button class="button" v-on:click="stop"><span><i class="fas fa-pause"></i></span></button>
      <button class="button" v-on:click="prev"><span><i class="fas fa-backward"></i></span></button>
      <button class="button" v-on:click="next"><span><i class="fas fa-forward"></i></span></button>
      <b-taglist attached>
        <b-tag type="is-dark">Timer</b-tag>
        <b-tag type="is-info">
          <i18n v-bind:path="timerTypeI18nPath"/>
        </b-tag>
      </b-taglist>
    </div>
    <div>
      <player-timer
        class="card"
        v-for="player_timer in turnSortedPlayerTimers" :key="player_timer.id"
        :player_timer="player_timer" :timer="timer" />
    </div>
  </section>
</template>

<script>
import Timer, { TimerTypes } from '@/utils/api/Timer';
import PlayerTimer from '@/components/timer/PlayerTimer';

export default {
  name: 'TimerPage',
  components: {PlayerTimer},
  data() {
    return {
      timer: null
    };
  },
  computed: {
    turnSortedPlayerTimers() {
      const n_players = this.timer.player_timers.length;
      let  player_timers = this.timer.player_timers.slice(0);
      player_timers.sort((p1, p2) => p1.turn_order - p2.turn_order);
      let array = new Array(n_players);
      for (let i = 0; i < n_players; ++i) {
        array[i] = player_timers[(this.timer.current_player + i) % n_players];
      }
      return array;
    },
    timerTypeI18nPath() {
      return {
        [TimerTypes.COUNT_UP]: 'timer.type.count_up',
        [TimerTypes.COUNT_DOWN]: 'timer.type.count_down',
        [TimerTypes.RELOAD]: 'timer.type.reload'
      }[this.timer.timer_type];
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
    error(error) {
      console.log(error);
    }
  },
  methods: {
    setTimer(timer) {
      this.timer = timer;
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
    }
  },
  async created() {
    this.setTimer(await Timer.fetch(this.$route.params.timerid));
    this.follow();
  },
  beforeDestroy() {
    this.unfollow();
    this.timer = null;
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
</style>
