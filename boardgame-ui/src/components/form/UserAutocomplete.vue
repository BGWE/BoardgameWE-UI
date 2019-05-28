<template>
  <b-autocomplete
    v-model="searchString"
    :data="filteredUsers"
    :size="size"
    field="fullname"
    icon="search"
    @input="$emit('input', null)"
    @select="option => $emit('input', option)"
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
      searchString: ''
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
  methods: {
    fullName(user) {
      return `${user.name} ${user.surname[0]}. (${user.username})`;
    }
  },
  created() {
    if(this.value) {
      this.searchString = this.fullName(this.value);
    }
  },
};
</script>
