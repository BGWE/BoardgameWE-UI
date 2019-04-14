<template>
  <div class="media-left">
    <figure v-if="useIcon" class="image is-64x64"><span><i class="fa-3x far fa-calendar-alt" /></span></figure>
    <figure v-if="!useIcon" class="image is-64x64 is-rounded" :style="{backgroundImage: `url('${thumbnail}')`}" />
  </div>
</template>

<script>
import { ActivityTypes } from '@/utils/api/Activity';
export default {
  name: 'ActivityBoxLeftMedia',
  props: {
    activity: Object,
    thumbnail: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    useIcon() {
      return this.activity.type === ActivityTypes.EVENT_USER_JOIN || this.activity.type === ActivityTypes.USER_JOIN_EVENT;
    }
  }
};
</script>

<style scoped>
  figure.image {
    text-align: center;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  figure.is-rounded {
    border-radius: 32px;
  }
</style>
