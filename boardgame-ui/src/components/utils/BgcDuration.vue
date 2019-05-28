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
      const mDuration = moment.duration(this.duration, 'minutes');

      if(mDuration.asHours() <= 0) {
        return `${mDuration.minutes()} ${this.$t('app.duration.minutesShort')}`;
      }

      const hoursLabel = this.$t('app.duration.hoursShort');
      const minutesLabel = this.$t('app.duration.minutesShort');

      if (mDuration.asHours() >= 24) {
        const nbDays = Math.floor(mDuration.asDays());
        return `${nbDays} ${this.$tc('app.duration.daysShort', nbDays)}` + (mDuration.hours() > 0 ? ` ${mDuration.hours()} ${hoursLabel}` : '');
      }
      else if (mDuration.asHours() >= 1) {
        return `${Math.floor(mDuration.asHours())} ${hoursLabel}` + (mDuration.minutes() > 0 ? ` ${mDuration.minutes()} ${minutesLabel}` : '');
      }
      else {
        return `${mDuration.minutes()} ${minutesLabel}`;
      }
    }
  }
};
</script>
