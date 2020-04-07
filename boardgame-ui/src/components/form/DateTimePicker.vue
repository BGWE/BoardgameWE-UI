<template>
  <b-field>
    <b-datepicker
      v-model="date"
      placeholder="Click to select..."
      icon="calendar-day"
      :min-date="minDate"
      :disabled="disabled"
    />

    <b-timepicker
      v-model="time"
      placeholder="Click to select..."
      icon="clock"
      :disabled="disabled"
    />
  </b-field>
</template>

<script>
export default {
  name:'DateTimePicker',

  props: {
    value: Date,
    name: String,
    minDate: Date,
    disabled: Boolean
  },

  data() {
    return {
      date: new Date(),
      time: new Date(),
      dateTime: new Date()
    };
  },
  watch: {
    value() {
      this.setValue();
    },

    date(newDate) {
      this.dateTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      this.$emit('input', this.dateTime);
    },

    time(newTime) {
      this.dateTime.setHours(newTime.getHours());
      this.dateTime.setMinutes(newTime.getMinutes());
      this.$emit('input', this.dateTime);
    }
  },
  methods: {
    setValue() {
      if (this.value) {
        this.date.setFullYear(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
        this.time.setHours(this.value.getHours());
        this.time.setMinutes(this.value.getMinutes());
        this.time = new Date(this.time.getTime());  // create new object so that value correctly updated in b-timerpicker

        this.dateTime.setFullYear(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
        this.dateTime.setHours(this.time.getHours(), this.time.getMinutes());
      }
    }
  },
  created() {
    this.setValue();
    this.$emit('input', this.dateTime);
  }
};
</script>

<style scoped>

</style>
