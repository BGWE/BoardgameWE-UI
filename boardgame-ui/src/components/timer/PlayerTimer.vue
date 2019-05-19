<template>
  <div class="box media player-timer" 
        v-bind:style="{['background-color']: player_timer.color}" 
        v-bind:class="{'is-bold': this.is_selected}">
    <div class="media-left player-name-box has-text-centered" v-bind:class="{'has-text-weight-bold': this.is_selected}">
      <p v-bind:style="{color: textColor}">{{playerName}}</p>
    </div>
    <div class="media-content" v-bind:class="{'has-text-weight-semibold': this.is_selected}">
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
    <div>
      <span><i class="fa fa-bars" v-bind:style="{color: textColor}"></i></span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { TimerTypes } from '@/utils/api/Timer';

export default {
  name: 'PlayerTimer',
  props: ['timer', 'player_timer', 'is_selected', 'is_running'],
  data() {
    return {
      interval: null,
      display_time: 0  // time to display in the timer
    };
  },
  computed: {
    textColor() {
      const match = this.player_timer.color.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/);
      const red = parseInt(match[1], 16) / 255, green = parseInt(match[2], 16) / 255, blue = parseInt(match[3], 16) / 255; 
      const luminance = (0.299 * red + 0.587 * green + 0.114 * blue);
      return luminance > 0.72 ? '#494949' : '#FFFFFF'; // dark colors - white font
    },
    playerName() {
      return this.player_timer.user === null ? this.player_timer.name : this.player_timer.user.name;
    }
  },
  watch: {
    'player_timer.start': function(value) {
      this.refreshElapsed();
      if(value) {
        this.startInterval();
      }
      else {
        this.stopInterval();
      }
    },
    'display_time': function(value) {
      this.$emit('update_display_time', value);
    },
  },
  methods: {
    refreshElapsed() {
      const start = this.player_timer.start;
      /**
       * If necessary, can be improved: recorded start time (server time) is diff-ed with the current browser time 
       * which might cause a difference if server and browser do not have the same time.
       */
      const since_start = start !== null ? moment().utc().diff(moment(this.player_timer.start)) : 0;
      const elapsed = moment.duration(this.player_timer.elapsed).add(since_start);
      if (this.timer.timer_type === TimerTypes.COUNT_UP) {
        this.display_time = elapsed;
      } 
      else {
        this.display_time = moment.duration(this.timer.initial_duration).subtract(elapsed);
        if (this.display_time.milliseconds() < 0) {
          this.display_time = moment.duration(0);
        }
      } 
    },
    hours() {
      return this.format(this.display_time.hours(), 2);
    },
    minutes() {
      return this.format(this.display_time.minutes(), 2);
    },
    seconds() {
      return this.format(this.display_time.seconds(), 2);
    },
    millis() {
      return this.format(this.display_time.milliseconds(), 3);
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
}

.player-timer.is-bold {
  opacity: 1;
  -moz-box-shadow:    0px 0px 8px 5px #eeeeee;
  -webkit-box-shadow: 0px 0px 8px 5px #eeeeee;
  box-shadow:         0px 0px 8px 5px #eeeeee;
}

.player-timer {
  margin: 1em;

  opacity: 0.3;
}

.player-name-box {
  width: 25%;
}

.button.is-outlined.is-arrow {
  background-color: transparent;
  border-color: black;
  color: black;

  margin-left: 5px;
}

</style>
