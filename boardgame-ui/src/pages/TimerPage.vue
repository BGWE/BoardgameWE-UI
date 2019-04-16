<template>
  <div v-if=timer>
    <section class="section timer_buttons">
      <button class="button" v-on:click="start"><span><i class="fas fa-play"></i></span></button>
      <button class="button" v-on:click="stop"><span><i class="fas fa-pause"></i></span></button>
      <button class="button"><span><i class="fas fa-backward"></i></span></button>
      <button class="button"><span><i class="fas fa-forward"></i></span></button>
    </section>
  <section>
  <section class="section">
    <h1>Timer ({{timer.id}} - {{timer.timer_type}})</h1>
    <div class="card" v-for="player_timer in timer.player_timers" :key="player_timer.id">
      <header class="card-header">
        <p class="card-header-title">{{player_timer.user === null ? player_timer.name : player_timer.user.name}} ({{player_timer.turn_order}}) </p>
      </header>
      <div class="card-content">
        <div class="content">
          <timer-duration :timer=timer :player_timer=player_timer />
        </div>
      </div>
    </div>
  </section>
  </section>
  </div>
</template>

<script>
import Timer from '@/utils/api/Timer';
import TimerDuration from '@/components/timer/TimerDuration';
export default {
  name: 'TimerPage',
  components: {TimerDuration},
  sockets: {
    connect() {
      console.log('connect');
    },
    timer_follow() {
      console.log('timer_follow');
    },
    timer_unfollow() {
      console.log('timer_unfollow');
    },
    timer_start(timer) {
      console.log('timer_start');
      this.timer = timer;
    },
    timer_stop(timer) {
      console.log('timer_stop');
      this.timer = timer;
    },
    error(error) {
      console.log(error);
    }
  },
  data() {
    return {
      timer: null
    };
  },
  methods: {
    start() {
      this.$socket.emit('timer_start');
    },
    stop() {
      this.$socket.emit('timer_stop');
    }
  },
  beforeDestroy() {
    this.$socket.emit('timer_unfollow');
  },
  async created() {
    this.timer = await Timer.fetch(this.$route.params.timerid);
    this.timer.player_timers.sort(t => t.turn_order);
    this.$socket.emit('timer_follow', this.timer.id);
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
