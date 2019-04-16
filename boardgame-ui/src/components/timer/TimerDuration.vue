<template>
  <span>
    <span class="hours">{{hours()}}</span>
    <span class="middle">:</span>
    <span class="minutes">{{minutes()}}</span>
    <span class="middle">:</span>
    <span class="seconds">{{seconds()}}</span>
    <span class="middle">.</span>
    <span lcass="millis">{{millis()}}</span>
  </span>
</template>

<script>
import moment from 'moment';
import { iso8601ToMoment } from '@/utils/helper';

export default {
  name: 'TimerDuration',
  props: ['timer', 'player_timer'],
  data() {
    return {
      interval: null,
      elapsedMillis: 0
    };
  },
  created() {
    this.refreshElapsed();
    if (this.player_timer.start) {
      this.interval = setInterval(this.refreshElapsed, 5);
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  methods: {
    refreshElapsed() {
      const start = this.player_timer.start;
      const since_start = start !== null ? moment().diff(iso8601ToMoment(this.player_timer.start)) : 0;
      this.elapsedMillis = this.player_timer.elapsed + since_start;
    },
    hours() {
      return this.format(Math.floor(this.elapsedMillis / (1000 * 60 * 60)), 2);
    },
    minutes() {
      return this.format(Math.floor(this.elapsedMillis / (1000 * 60)) % 60, 2);
    },
    seconds() {
      return this.format(Math.floor(this.elapsedMillis / 1000) % 60, 2);
    },
    millis() {
      return this.format(this.elapsedMillis % 1000, 3);
    },
    format(d, l) {
      let v = String(d);
      while (v.length < l) v = '0' + v;
      return v;
    }
  }
};
</script>

<style scoped>
</style>