<template>
  <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <router-link :to="{name: 'home'}" class="navbar-item">
          <strong>{{$t('app.appName')}}</strong>
        </router-link>

        <a role="button" class="navbar-burger burger" :class="{'is-active': openedMenu}" @click="openedMenu=!openedMenu"
          aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active': openedMenu}">
        <div class="navbar-start">
          <template v-if="currentUser">
            <router-link :to="{name: 'events'}" class="navbar-item">
              {{$t('navbar.events')}}
            </router-link>

            <a class="navbar-item">
              {{$t('navbar.my-library')}}
            </a>
          </template>

          <a class="navbar-item">
            {{$t('navbar.all-board-games')}}
          </a>
        </div>

        <div class="navbar-end">
          <div v-if="!currentUser" class="navbar-item">
            <router-link :to="{name: 'login'}" class="button is-primary">
              {{$t('navbar.log-in')}}
            </router-link>
          </div>
          <div v-else class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              {{currentUser.name}} {{currentUser.surname[0]}}.
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                {{$t('navbar.preferences')}}
              </a>
              <a @click="logout()" class="navbar-item">
                {{$t('navbar.log-out')}}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
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
