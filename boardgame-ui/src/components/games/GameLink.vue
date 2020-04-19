<template>
  <router-link :to="{name: 'game', params: {id: game.id}}">
    <slot>{{game.board_game.name}}</slot>
  </router-link>
</template>

<script>
export default {
  props: {
    game: Object
  }
};
</script>

