<template>
  <router-link :to="{name: 'game', params: {id: game.id}}">{{game.board_game.name}}</router-link>
</template>

<script>
export default {
  props: {
    game: Object
  }
};
</script>

