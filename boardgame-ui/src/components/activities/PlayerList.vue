<template>
  <span>
    <span v-if="names.length == 1">
      <strong>{{names[0]}}</strong>
    </span>
    <span v-else-if="names.length < 4">
      <span v-for="name in names.slice(0, -3)" :key="name" ><strong>{{name}}</strong>,&nbsp;</span>
      <strong>{{names[names.length - 2]}}</strong>&nbsp;<i18n path="and"/>&nbsp;<strong>{{names[names.length - 1]}}</strong>
    </span>
    <span v-else>
      <span v-for="name in names.slice(0, 4)" :key="name" ><strong>{{name}}</strong>,&nbsp;</span>...
    </span>
  </span>
</template>

<script>
export default {
  name: 'ActivityBoxLeftMedia',
  props: ['players'],
  computed: {
    names() {
      return this.players.map(p => (p.user !== null ? p.user.name : p.name));
    }
  }
};
</script>

<style scoped>
</style>
