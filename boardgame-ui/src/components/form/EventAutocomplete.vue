<template>
  <b-autocomplete
    v-model="searchString"
    :data="events"
    :size="size"
    field="name"
    icon="search"
    @select="handleSelect"
    ref="autocomplete"
  >
    <template slot="empty">
      {{$t('global.no-result')}}
    </template>
  </b-autocomplete>
</template>

<script>
export default {
  props: {
    value: Object,
    size: String,
    events: Array
  },
  data() {
    return {
      searchString: '',
      internalValue: null
    };
  },
  watch: {
    value(val) {
      if (val != this.internalValue) {
        this.setValue();
      }
    }
  },
  methods: {
    handleSelect(option) {
      this.internalValue = option;
      this.$emit('input', option);
    },
    setValue() {
      if(this.value) {
        this.$refs.autocomplete.setSelected(this.value);
      }
      else {
        this.searchString = '';
      }
    }
  },
  mounted() {
    this.setValue();
  },
};
</script>
