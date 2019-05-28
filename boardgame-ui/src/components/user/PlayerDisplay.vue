<template>
	<span>
    <user-link v-if="player.user" :user="player.user"></user-link>
    <span v-else>{{player.name}}</span>
  </span>
</template>

<script>
import UserLink from '@/components/user/UserLink';
/**
 * Player display: user link if registered user, otherwise simply show player name. 
 */
export default {
  props: {
    player: Object
  },
  components: {
    UserLink
  },
};
</script>

<style scoped>
</style>