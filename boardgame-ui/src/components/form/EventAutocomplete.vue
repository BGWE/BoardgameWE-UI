<template>
  <b-autocomplete
    v-model="searchString"
    :data="filteredEvents"
    :size="size"
    field="name"
    icon="search"
    @select="option => $emit('input', option)"
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
    value: [Object, String],
    size: String,
    events: Array
  },
  data() {
    return {
      searchString: ''
    };
  },
  computed: {
    filteredEvents() {
      let str = this.searchString.toLowerCase();
      return this.events.filter(event => {
        return (!str || event.name.toLowerCase().indexOf(str) >= 0);
      });
    }
  },
  mounted() {
    if (this.value) {
      this.$refs.autocomplete.setSelected(this.value);
    }
  },
};
</script>
