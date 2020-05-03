<template>
  <router-link :to="{name: 'user-profile', params: {id: user.id}}">{{displayName}}</router-link>
</template>

<script>
export default {
  props: {
    user: Object,
    surname: Boolean
  },
  computed: {
    displayName() {
      let disp = this.user.name;
      if(this.surname) {
        disp += ' ' + this.user.surname;
      }
      return disp;
    }
  }
};
</script>

