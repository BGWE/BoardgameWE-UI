<template>
  <div v-if=timer>
    <h1>Timer ({{timer.id}} - {{timer.timer_type}})</h1>
    <p v-for="player_timer in timer.player_timers" :key="player_timer.id">{{player_timer.user == null ? player_timer.name : player_timer.user.name}}</p>
  </div>
</template>

<script>
import Timer from '@/utils/api/Timer';
export default {
  name: 'TimerPage',
  sockets: {
    connect() {
      console.log('connect');
    },
    timer_follow() {
      console.log('timer_follow');
    },
    timer_unfollow() {
      console.log('timer_unfollow');
    }
  },
  data() {
    return {
      timer: null
    };
  },
  beforeDestroy() {
    this.$socket.emit('timer_unfollow');
  },
  async created() {
    this.timer = await Timer.fetch(this.$route.params.timerid);
    this.$socket.emit('timer_follow', this.timer.id);
  }
};
</script>

<style scoped>

</style>
