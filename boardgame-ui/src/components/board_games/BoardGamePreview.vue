<template>
<div class="card" :class="{'mobile-vertical': mobileVertical}">
  <div class="card-image">
    <div v-if="count > 1" class="count" :title="$t('boardgame.count-copies', {count})">
      {{count}}
    </div>
    <wish-list-count v-else-if="wishCount" :count="wishCount" class="wishlist-count" />
    <span v-if="boardGame.providedByOther" :title="$t('boardgame.provided-by-other')" class="icon provided">
      <i class="fa fa-check"></i>
    </span>
    <figure
      class="image is-3by2 background"
      :class="{provided: providedByOther}"
      :style="{backgroundImage: `url('${boardGame.image}')`}">
    </figure>
  </div>
  <div class="card-content">
    <a class="delete is-small" v-if="deleteButton" @click="$emit('delete')"></a>
    <p class="board-game-name">
      <router-link :to="{name: 'board-game', params: {id: boardGame.id}}" :title="boardGame.name">
        {{boardGame.name}}
      </router-link>
    </p>
    <p class="board-game-year">({{boardGame.year_published}})</p>
    <div class="board-game-slot"><slot></slot></div>
  </div>
</div>
</template>

<script>
import WishListCount from '@/components/wish_list/WishListCount';

export default {
  props: {
    boardGame: Object,
    deleteButton: Boolean,
    wishCount: Number,
    providedByOther: Boolean,
    mobileVertical: {
      type: Boolean,
      default: true
    }
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
@import "~bulma/sass/utilities/mixins.sass";

figure.provided {
  filter: grayscale(100%);
  opacity: 0.75;
}

.board-game-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.board-game-year {
  font-size: 0.75em;
  text-align: center;
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

.icon.provided {
  display: block;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  text-align: center;
  color: $green;
  font-size: 3em;
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

.is-small.card {
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

@include mobile {
  .card:not(.mobile-vertical) {
    display: flex;
    flex-direction: row;
    padding: 0.75em 1.5em;

    figure {
      width: 80px;
      height: 80px;
      border-radius: 40px;
    }

    .card-content {
      flex: 1;
      text-align: left !important;
      position: static;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .board-game-name, .board-game-year {
      text-align: left;
      white-space: initial;
    }
  }
}
</style>
