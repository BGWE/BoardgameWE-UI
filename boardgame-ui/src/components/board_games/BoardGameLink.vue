<template>
  <router-link :to="{name: 'board-game', params: {id: boardGame.id}}">{{boardGame.name}}</router-link>
</template>

<script>
export default {
  props: {
    boardGame: Object
  }
};
</script>

