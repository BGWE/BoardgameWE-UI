<template>
  <span v-if="count" class="wishlist-count" :title="$tc('boardgame.in-count-wishlists', count, {count})">
    <i class="fas fa-heart"></i>
    <span>{{count}}</span>
  </span>
</template>

<script>
export default {
  props: {
    count: Number
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.wishlist-count {
  display: inline-block;
  position: relative;
  font-size: 0.9em;
  font-weight: bold;
  color: $primary-invert;
  line-height: 1.2em;

  .fas {
    color: $red;
    font-size: 1.5em;
    text-shadow: 3px 0px 0px white, -3px 0px 0px white, 0px 3px 0px white;
  }

  span {
    position: absolute;
    top: 0.1em;
    left: 0px;
    display: inline-block;
    width: 100%;
    text-align:center;
  }
}
</style>

