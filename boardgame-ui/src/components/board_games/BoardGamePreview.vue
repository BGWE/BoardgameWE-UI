<template>
<div :class="{'mobile-vertical': mobileVertical}">
  <div class="card vertical">
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
      <p class="board-game-name has-text-centered">
        <router-link :to="{name: 'board-game', params: {id: boardGame.id}}">{{boardGame.name}}</router-link>
      </p>
      <p class="board-game-year has-text-centered">({{boardGame.year_published}})</p>
      <div class="board-game-slot"><slot></slot></div>
    </div>
  </div>
  <div class="card horizontal">
    <div class="card-content">
      <a class="delete is-small" v-if="deleteButton" @click="$emit('delete')"></a>
      <div class="columns is-mobile">
        <div class="column is-narrow">
          <figure class="image background is-80x80 is-rounded" :style="{backgroundImage: `url('${boardGame.image}')`}"></figure>
        </div>
        <div class="column vertical-center">
          <p>
            <router-link :to="{name: 'board-game', params: {id: boardGame.id}}">{{boardGame.name}}</router-link>
          </p>
          <p class="board-game-year">({{boardGame.year_published}})</p>
          <div v-if="count > 1" class="tags has-addons" :title="$t('boardgame.count-copies', {count})">
            <span class="tag is-primary"><i class="fas fa-copy"></i></span>
            <span class="tag is-light">{{count}}</span>
          </div>
        </div>
      </div>
    </div>
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

.is-small .card {
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

.vertical-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tags {
  margin-top: 0.75em;
}

@include desktop {
  .card.horizontal {
    display: none;
  }
}

@include touch {
  div:not(.mobile-vertical) > .card.vertical {
    display: none;
  }

  .mobile-vertical .card.horizontal {
    display: none;
  }
}
</style>
