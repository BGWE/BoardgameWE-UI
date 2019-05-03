<template>
  <div class="card" v-bind:style="{['background-color']: player_timer.color}">
    <header class="card-header">
      <p v-bind:style="{color: textColor}" class="card-header-title">{{playerName}}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <span class="time-counter" v-bind:style="{color: textColor}">
          <span class="hours">{{hours()}}</span>
          <span class="middle">:</span>
          <span class="minutes">{{minutes()}}</span>
          <span class="middle">:</span>
          <span class="seconds">{{seconds()}}</span>
          <span class="middle">.</span>
          <span class="millis">{{millis()}}</span>
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
  computed: {
    textColor() {
      const match = this.player_timer.color.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/);
      const red = parseInt(match[1], 16) / 255, green = parseInt(match[2], 16) / 255, blue = parseInt(match[3], 16) / 255; 
      const luminance = (0.299 * red + 0.587 * green + 0.114 * blue);
      return luminance > 0.5 ? '#000000' : '#FFFFFF'; // dark colors - white font
    },
    playerName() {
      return this.player_timer.user === null ? this.player_timer.name : this.player_timer.user.name;
    }
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
.card-header-title {
  background-color: rgba(0, 0, 0, 0.1);
};
</style>
