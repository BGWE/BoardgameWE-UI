<template>
  <ValidationProvider
    :vid="vid"
    :name="$attrs.name || $attrs.label"
    :rules="rules"
    :mode="mode"
    v-slot="{ errors }"
  >
    <b-field
      v-bind="$attrs"
      :type="{ 'is-danger': errors[0] }"
      :message="errors"
    >
      <user-autocomplete
        v-bind="$attrs"
        v-model="innerValue"
        :users="users"
        :excludedIds="excludedIds"
        :allowNew="allowNew"
      />
    </b-field>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import UserAutocomplete from '@/components/form/UserAutocomplete';

export default {
  components: {
    ValidationProvider,
    UserAutocomplete
  },

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
    // must be included in props
    value: {
      type: null
    },
    users: Array,
    excludedIds: {
      type: Array,
      default: () => []
    },
    allowNew: { // allow to specify name of unregister user
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    innerValue: ''
  }),

  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit('input', newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    }
  },

  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  }
};
</script>
