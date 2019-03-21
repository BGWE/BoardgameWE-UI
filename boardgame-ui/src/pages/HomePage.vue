<template>
  <div>
    <user-home-page v-if="currentUser"></user-home-page>
    <guest-home-page v-else></guest-home-page>
  </div>
</template>

<script>
import UserHomePage from '@/pages/UserHomePage';
import GuestHomePage from '@/pages/GuestHomePage';

export default {
  name: 'HomePage',
  components: {UserHomePage, GuestHomePage},
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  }
};
</script>
