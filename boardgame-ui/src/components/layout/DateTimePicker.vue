<template>
  <b-field>
    <b-datepicker
      v-model="date"
      placeholder="Click to select..."
      icon="calendar-day"
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
export default {
  name:'DateTimePicker',

  props: {
    value: Date,
    name: String,
    minDate: Date
  },

  data() {
    return {
      date: new Date(),
      time: new Date(),
      dateTime: new Date(),
      //minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    };
  },
  watch: {
    date: function(newDate) {
      this.dateTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      this.$emit('input', this.dateTime);
    },

    time: function(newTime) {
      this.dateTime.setHours(newTime.getHours());
      this.dateTime.setMinutes(newTime.getMinutes());
      this.$emit('input', this.dateTime);
    }
  },
  created() {
    if (this.value) {
      this.date.setFullYear(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
      this.time.setHours(this.value.getHours());
      this.time.setMinutes(this.value.getMinutes());

      this.dateTime.setFullYear(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
      this.dateTime.setHours(this.time.getHours(), this.time.getMinutes());
    }
    this.$emit('input', this.dateTime);
  }
};
</script>

<style scoped>

</style>
