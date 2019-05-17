<template>
  <section class="hero is-dark-secondary">
    <div class="hero-head">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="container">
          <div class="navbar-brand">
            <router-link :to="{name: 'home'}" exact class="navbar-item">
              <img src="@/assets/BGCLogo.png" :alt="$t('app.appName')">
            </router-link>

            <a role="button" class="navbar-burger burger" :class="{'is-active': openedMenu}" @click="openedMenu=!openedMenu"
              aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active': openedMenu}">
            <div class="navbar-end">
              <template v-if="currentUser">
                <router-link :to="{name: 'events'}" class="navbar-item">
                  {{$t('navbar.events')}}
                </router-link>

                <router-link :to="{name: 'library'}" class="navbar-item">
                  {{$t('navbar.my-library')}}
                </router-link>

                <router-link :to="{name: 'timers'}" class="navbar-item">
                  {{$t('navbar.timers')}}
                </router-link>
              </template>

              <div v-if="!currentUser" class="navbar-item">
                <router-link :to="{name: 'login'}" class="button is-primary">
                  {{$t('navbar.log-in')}}
                </router-link>
              </div>
              <div v-else class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                  {{currentUser.name}} {{currentUser.surname[0]}}.
                </a>

                <div class="navbar-dropdown is-boxed">
                  <router-link :to="{name: 'preferences'}" class="navbar-item">
                    {{$t('navbar.preferences')}}
                  </router-link>
                  <router-link v-if="isUserAdmin" :to="{name: 'uservalidation'}" class="navbar-item">
                    {{$t('navbar.uservalidation')}}
                  </router-link>
                  <a @click="logout()" class="navbar-item">
                    {{$t('navbar.log-out')}}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LayoutNavbar',
  data() {
    return {
      openedMenu: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },

    isUserAdmin() {
      return this.currentUser.admin;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({name: 'home'});
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar-brand {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  img {
    max-height: 2.5em !important;
  }
}
</style>
