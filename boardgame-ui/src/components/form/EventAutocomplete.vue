<template>
  <b-autocomplete
    v-model="searchString"
    :data="filteredData"
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
    value: Object,
    size: String,
    inputData: Array
  },
  data() {
    return {
      searchString: ''
    };
  },
  computed: {
    filteredData() {
      let str = this.searchString.toLowerCase();
      return this.inputData.filter(data => {
        return (!str || data.name.toLowerCase().indexOf(str) >= 0);
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
