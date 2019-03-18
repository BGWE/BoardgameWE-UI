<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-3by2 board-game-image" :style="{backgroundImage: `url('${boardGame.image}')`}">
      </figure>
    </div>
    <div class="card-content">
      <a class="delete is-small" v-if="deleteButton" @click="$emit('delete')"></a>
      <p class="board-game-name has-text-centered">{{boardGame.name}}</p>
      <p class="board-game-year has-text-centered">({{boardGame.year_published}})</p>
      <div class="board-game-slot"><slot></slot></div>
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

<style lang="scss" scoped>
.board-game-image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.board-game-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.board-game-year {
  font-size: 0.75em;
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

.board-game-slot {
  margin-top: 0.5em;
}

.card.is-small {
  .card-content {
    padding: 0.25em 0.75em;
  }

  .board-game-name {
    font-size: 0.8em;
  }

  .board-game-year {
    font-size: 0.6em;
  }
}
</style>
