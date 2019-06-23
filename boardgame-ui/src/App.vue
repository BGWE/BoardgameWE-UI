<template>
  <div id="app" class="page-container">
    <layout-navbar></layout-navbar>

    <div class="app-content">
      <router-view v-if="initialized"></router-view>
    </div>

    <footer class="footer footer-bottom">
      <div class="content has-text-centered">
        <p>
          <strong> Board Game Comp</strong> <img src="@/assets/componion.png" :alt="$t('app.appName')" style="height:1.1em; position:relative;top:0.2em"> <strong>nion</strong> by BGWE. Powered by <a href="https://bulma.io">Bulma</a>, <a href="https://vuejs.org">Vue.js</a>.
        </p>

      </div>
    </footer>

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
.page-container {
  position: relative;  
  min-height: 100vh;
}

.app-content {
  padding-bottom: 144px;
}

.footer-bottom {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 1.5em;
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
