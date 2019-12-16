<template>
  <router-link :to="{name: 'event', params: {eventid: event.id}}">{{event.name ? event.name : `Event #${event.id}`}}</router-link>
</template>

<script>
export default {
  props: {
    event: Object
  }
};
</script>

