<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-3by2 board-game-image" :style="{backgroundImage: `url('${boardGame.image}')`}">
      </figure>
    </div>
    <div class="card-content">
      <a class="delete is-small" v-if="deleteButton" @click="$emit('delete')"></a>
      <p class="board-game-name">{{boardGame.name}}</p>
      <p class="is-size-7 has-text-centered">({{boardGame.year_published}})</p>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'boardGame',
    'deleteButton'
  ]
};
</script>

<style scoped>
.board-game-image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.board-game-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.card-image {
  border-bottom: 2px solid #eee;
}

.card-content {
  padding: 0.75em 1.5em;
  position: relative;
}

.delete {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}
</style>
