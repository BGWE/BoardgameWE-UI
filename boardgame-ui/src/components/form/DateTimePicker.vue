<template>
  <ValidationProvider
    :vid="vid"
    :name="$attrs.name || $attrs.label"
    :rules="rules"
    :mode="mode"
    v-slot="{ errors }"
  >
    <b-field
      :type="{ 'is-danger': errors[0] }"
      :message="errors"
      v-bind="$attrs"
    >
      <b-datepicker
        v-bind="$attrs"
        v-model="date"
        placeholder="Click to select..."
        icon="calendar-day"
        :min-date="minDate"
        :disabled="disabled"
      />

      <b-timepicker
        v-bind="$attrs"
        v-model="time"
        placeholder="Click to select..."
        icon="clock"
        :disabled="disabled"
        :enable-seconds="false"
      />
    </b-field>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationProvider
  },

  name:'DateTimePicker',

  props: {
    vid: {
      type: String
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    mode : {
      type: String,
      default: 'passive'
    },
    value: Date,
    name: String,
    minDate: Date,
    disabled: Boolean,
    type: Object
  },

  data() {
    return {
      date: null,
      time: null,
      dateTime: null
    };
  },
  watch: {
    value() {
      this.setValue();
    },

    date(newDate) {
      if(!this.dateTime) {
        this.dateTime = new Date(newDate.getTime());
        this.time = new Date(newDate.getTime());
      }
      else {
        this.dateTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      }
      this.$emit('input', this.dateTime);
    },

    time(newTime) {
      if(!this.dateTime) {
        this.dateTime = new Date(newTime.getTime());
        this.date = new Date(newTime.getTime());
      }
      else {
        this.dateTime.setHours(newTime.getHours());
        this.dateTime.setMinutes(newTime.getMinutes());
      }
      this.$emit('input', this.dateTime);
    }
  },
  methods: {
    setValue() {
      if(this.value) {
        this.date = new Date(this.value.getTime());
        this.time = new Date(this.value.getTime());
      }
    }
  },
  created() {
    this.setValue();
  }
};
</script>

<style scoped>

</style>
