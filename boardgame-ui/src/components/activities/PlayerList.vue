<template>
  <span v-if="nbPlayers <= maxDisplayed">
    <span v-for="(player, index) in players" :key="player.id">
      <strong><user-link :user="player.user" /></strong>
      <span v-if="index < nbPlayers - 2">,&nbsp;</span>
      <span v-else-if="index === nbPlayers - 2">&nbsp;{{$t('and')}}&nbsp;</span>
    </span>
  </span>
  <span v-else>
    <span v-for="player in players.slice(0, maxDisplayed - 1)" :key="player.id">
      <strong><user-link :user="player.user" /></strong>,&nbsp;
    </span>
    <strong><user-link :user="players[maxDisplayed - 1].user" /></strong>
    {{$tc('global.and-count-others', nbPlayers - maxDisplayed)}}
  </span>
</template>

<script>
import UserLink from '@/components/user/UserLink';

export default {
  name: 'ActivityBoxLeftMedia',
  props: {
    'players': Array
  },
  components: {
    UserLink
  },
  computed: {
    maxDisplayed: () => 4,
    nbPlayers() {
      return this.players.length;
    }
  }
};
</script>
