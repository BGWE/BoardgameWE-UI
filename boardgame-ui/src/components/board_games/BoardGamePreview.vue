<template>
  <div class="card">
    <div class="card-image">
      <div v-if="count > 1" class="count" :title="$t('boardgame.count-copies', {count})">
        {{count}}
      </div>
      <wish-list-count v-else-if="wishCount" :count="wishCount" class="wishlist-count" />
      <figure class="image is-3by2 board-game-image" :style="{backgroundImage: `url('${boardGame.image}')`}"></figure>
    </div>
    <div class="card-content">
      <a class="delete is-small" v-if="deleteButton" @click="$emit('delete')"></a>
      <p class="board-game-name has-text-centered">
        <router-link :to="{name: 'board-game', params: {id: boardGame.id}}">{{boardGame.name}}</router-link>
      </p>
      <p class="board-game-year has-text-centered">({{boardGame.year_published}})</p>
      <div class="board-game-slot"><slot></slot></div>
    </div>
  </div>
</template>

<script>
import WishListCount from '@/components/wish_list/WishListCount';

export default {
  props: {
    'boardGame': Object,
    'deleteButton': Boolean,
    'wishCount': Number
  },
  components: {WishListCount},
  computed: {
    count() {
      return this.boardGame.count || 1;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

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
  position: relative;
}

.count {
  position: absolute;
  z-index: 10;
  top: -0.5em;
  right: -0.5em;
  background: $primary;
  width: 1.8em;
  height: 1.8em;
  font-size: 0.9em;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  color: $primary-invert;
  border: 3px solid white;
  line-height: 1.35em;
}

.wishlist-count {
  position: absolute;
  z-index: 10;
  top: -0.5em;
  right: -0.8em;
  font-size: 0.9em;
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

  .wishlist-count {
    font-size: 0.85em;
  }
}
</style>
