<template>
  <div id="app">
    <layout-navbar></layout-navbar>

    <div class="app-content">
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutNavbar from './components/layout/LayoutNavbar';

export default {
  name: 'app',
  components: {
    LayoutNavbar
  },
  created() {
    this.$store.dispatch('initializeStore');
  }
};
</script>

<style>

</style>
