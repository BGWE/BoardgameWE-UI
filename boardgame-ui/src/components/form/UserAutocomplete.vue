<template>
  <b-autocomplete
    v-model="searchString"
    :data="filteredUsers"
    :size="size"
    field="fullname"
    icon="search"
    @select="handleSelect"
    ref="autocomplete"
  >
    <template slot="empty">{{$t('global.no-result')}}</template>
  </b-autocomplete>
</template>

<script>
export default {
  props: {
    value: Object,
    size: String,
    users: Array,
    excludedIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchString: '',
      internalValue: null
    };
  },
  computed: {
    fullNamedUsers() {
      let clones = this.users.slice();
      clones.forEach(user => user.fullname = this.fullName(user));
      return clones;
    },
    filteredUsers() {
      let str = this.searchString.toLowerCase();
      return this.fullNamedUsers.filter(user => {
        return !this.excludedIds.includes(user.id) && (!str ||
          (user.name && user.name.toLowerCase().indexOf(str) >= 0 ||
           user.surname && user.surname.toLowerCase().indexOf(str) >= 0 ||
           user.fullname && user.fullname.toLowerCase().indexOf(str) >= 0 ||
           user.username && user.username.toLowerCase().indexOf(str) >= 0)
        );
      });
    }
  },
  watch: {
    value(val) {
      if(val != this.internalValue) {
        this.setValue();
      }
    }
  },
  methods: {
    fullName(user) {
      return `${user.name} ${user.surname[0]}. (${user.username})`;
    },
    handleSelect(option) {
      this.internalValue = option;
      this.$emit('input', option);
    },
    setValue() {
      if(this.value) {
        this.value.fullname = this.fullName(this.value);
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
