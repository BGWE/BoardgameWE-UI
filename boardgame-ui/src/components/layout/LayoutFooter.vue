<template>
  <footer class="footer footer-bottom">
    <div class="content has-text-centered">
      <p>
          <strong> Board Game Comp</strong> <img @click="postAchievement()" src="@/assets/componion.png" :alt="$t('app.appName')" style="height:1.1em; position:relative;top:0.2em"> <strong>nion</strong> by BGWE. Powered by <a href="https://bulma.io">Bulma</a>, <a href="https://vuejs.org">Vue.js</a>.
      </p>
    </div>
  </footer>
</template>

<script>
import User from '@/utils/api/User';

export default {
  name: 'LayoutFooter',
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  methods: {
    postAchievement() {
      if (this.currentUser) {
        this.$buefy.toast.open({
          message: 'You found me!',
          type: 'is-success'
        });
        return User.easterEgg();
      }
    }
  }
};
</script>

<style scoped>
.footer-bottom {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 1.5em;
}
</style>