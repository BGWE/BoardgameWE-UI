<template>
  <router-link :to="{name: 'user-profile', params: {id: user.id}}">{{user.name}}</router-link>
</template>

<script>
export default {
  props: {
    user: Object
  }
};
</script>

