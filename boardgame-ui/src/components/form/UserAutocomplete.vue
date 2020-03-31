<template>
  <b-autocomplete
    v-model="searchString"
    :data="filteredUsers"
    :size="size"
    field="fullname"
    icon="search"
    @select="option => $emit('input', option)"
    ref="autocomplete"
  >
    <template slot="empty">{{$t('global.no-result')}}</template>
    <template slot="footer" v-if="allowNew">
      <a @click="selectUnregisteredUser">
        <span>{{$t('user-autocomplete.unregistered-user', {name: searchString})}}</span>
      </a>
    </template>
  </b-autocomplete>
</template>

<script>
export default {
  props: {
    value: [Object, String],
    size: String,
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
    },
    selectUnregisteredUser() {
      this.$refs.autocomplete.setSelected(this.searchString);
    }
  },
  mounted() {
    if(this.value) {
      if(typeof this.value !== 'string') {
        this.value.fullname = this.fullName(this.value);
      }
      this.$refs.autocomplete.setSelected(this.value);
    }
  },
};
</script>
