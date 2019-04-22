<template>
  <div class="card" v-bind:style="{['background-color']: player_timer.color}">
    <header class="card-header">
      <p class="card-header-title">{{player_timer.user === null ? player_timer.name : player_timer.user.name}} ({{player_timer.turn_order}}) </p>
    </header>
    <div class="card-content">
      <div class="content">
        <span>
          <span class="hours">{{hours()}}</span>
          <span class="middle">:</span>
          <span class="minutes">{{minutes()}}</span>
          <span class="middle">:</span>
          <span class="seconds">{{seconds()}}</span>
          <span class="middle">.</span>
          <span lcass="millis">{{millis()}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { iso8601ToMoment } from '@/utils/helper';

export default {
  name: 'PlayerTimer',
  props: ['timer', 'player_timer'],
  data() {
    return {
      interval: null,
      elapsedMillis: 0
    };
  },
  watch: {
    'player_timer.start': function(value) {
      if(value) {
        this.startInterval();
      }
      else {
        this.stopInterval();
      }
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
    },
    startInterval() {
      if (this.player_timer.start) {
        this.interval = setInterval(this.refreshElapsed, 5);
      }
    },
    stopInterval() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  },
  created() {
    this.refreshElapsed();
    this.startInterval();
  },
  beforeDestroy() {
    this.stopInterval();
  }
};
</script>

<style scoped>
</style>
