<template>
  <div id="app">
    <layout-navbar></layout-navbar>

    <div class="app-content">
      <div class="container">
        <router-view v-if="initialized"></router-view>
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
  computed: {
    initialized() {
      return this.$store.state.initialized;
    }
  },
  created() {
    this.$store.dispatch('initializeStore');
  }
};
</script>

<style>
.has-background-gold {
  background-color: rgb(249, 223, 75) !important;
}
.has-background-silver {
  background-color: rgb(192,192,192) !important;
}
.has-background-bronze {
  background-color: rgb(205, 127, 50) !important;
}
</style>
