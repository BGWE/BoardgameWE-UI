<template>
  <div id="app" class="page-container">
    <layout-navbar></layout-navbar>

    <div class="app-content">
      <router-view v-if="initialized"></router-view>
    </div>

    <layout-footer></layout-footer>

  </div>
</template>

<script>
import LayoutNavbar from './components/layout/LayoutNavbar';
import LayoutFooter from './components/layout/LayoutFooter';

export default {
  name: 'app',
  components: {
    LayoutNavbar,
    LayoutFooter
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
.page-container {
  position: relative;  
  min-height: 100vh;
}

.app-content {
  padding-bottom: 144px;
}

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
