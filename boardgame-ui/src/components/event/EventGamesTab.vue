<template>
  <games-list :event="event" :canEdit="event.current.can_write">
    <template #emptyInfoMessage>
      <b-message type="is-info" has-icon icon-size="is-small">
        {{$t('event.games.info-message')}}
      </b-message>
    </template>

    <template #addButton v-if="event.current.can_write">
      <router-link :to="{name: 'add-game-event'}" class="button is-primary">
        {{$t('button.add-game')}}
      </router-link>
    </template>
  </games-list>
</template>

<script>
import GamesList from '@/components/games/GamesList';

export default {
  props: {
    event: Object
  },
  components: {
    GamesList
  }
};
</script>
