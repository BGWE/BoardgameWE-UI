<template>
  <span>{{formattedDuration}}</span>
</template>

<script>
import moment from 'moment-timezone';

export default {
  props: {
    duration: Number
  },
  computed: {
    formattedDuration() {
      let mDuration = moment.duration(this.duration, 'minutes');

      if(mDuration.hours() > 0) {
        let hoursLabel = this.$t('app.duration.hoursShort');
        if(mDuration.minutes() == 0) {
          return `${mDuration.hours()} ${hoursLabel}`;
        }
        return `${mDuration.hours()} ${hoursLabel} ${mDuration.minutes()}`;
      }
      else {
        return `${mDuration.minutes()} ${this.$t('app.duration.minutesShort')}`;
      }
    }
  }
};
</script>
