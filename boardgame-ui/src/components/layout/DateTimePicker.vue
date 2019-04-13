<template>
  <b-field>
    <b-datepicker
      v-model="date"
      placeholder="Click to select..."
      icon="calendar-today"
      :min-date="minDate">
    </b-datepicker>

    <b-timepicker
      v-model="time"
      placeholder="Click to select..."
      icon="clock">
    </b-timepicker>
  </b-field>
</template>

<script>
import BDatepicker from 'buefy/src/components/datepicker/Datepicker';
import BTimepicker from 'buefy/src/components/timepicker/Timepicker';

export default {
  name:'DateTimePicker',

  props: {
    value: Date,
    minDate: Date,
    name: String
  },

  components: {
    BDatepicker,
    BTimepicker
  },

  data() {
    const today = new Date();

    return {
      date: new Date(),
      time: new Date(),
      dateTime: new Date(),
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    };
  },

  watch: {
    date: function(newDate, oldDate) {
      this.dateTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      this.$emit('input', this.dateTime);
    },

    time: function(newTime, oldTime) {
      this.dateTime.setHours(newTime.getHours());
      this.dateTime.setMinutes(newTime.getMinutes());
      this.$emit('input', this.dateTime);
    }
  },

  created() {
    this.$emit('input', this.dateTime);
  }
};
</script>

<style scoped>

</style>
