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
              aria-label="menu" aria-expanded="false" data-target="main navigation">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="main navigation" class="navbar-menu" :class="{'is-active': openedMenu}">
            <div class="navbar-end">
              <template v-if="currentUser">
                <router-link :to="{name: 'events'}" class="navbar-item">
                  {{$t('navbar.events')}}
                </router-link>

                <router-link :to="{name: 'timers'}" class="navbar-item">
                  {{$t('navbar.timers')}}
                </router-link>
              </template>

              <div v-if="!currentUser" class="navbar-item">
                <div class="buttons">
                  <router-link :to="{name: 'login'}" class="button is-primary">
                    {{$t('navbar.log-in')}}
                  </router-link>
                  <router-link :to="{name: 'register'}" class="button is-secondary">
                    {{$t('navbar.register')}}
                  </router-link>
                </div>
              </div>
              <div v-else class="navbar-item has-dropdown is-hoverable">
                <span class="navbar-link-wrapper">
                  <router-link exact :to="{name: 'user-profile', params: {id: currentUser.id}}" class="navbar-link navbar-link-custom">
                    <span class="icon">
                      <i class="fas fa-user-circle"></i>
                    </span>
                    {{currentUser.name}} {{currentUser.surname[0]}}.
                  </router-link>
                </span>

                <div class="navbar-dropdown is-boxed">
                  <router-link :to="{name: 'user-library', params: {id: currentUser.id}}" class="navbar-item">
                    {{$t('navbar.my-library')}}
                  </router-link>
                  <router-link :to="{name: 'user-wish-list', params: {id: currentUser.id}}" class="navbar-item">
                    {{$t('navbar.my-wish-list')}}
                  </router-link>
                  <router-link :to="{name: 'user-games', params: {id: currentUser.id}}" class="navbar-item">
                    {{$t('navbar.my-games')}}
                  </router-link>
                  <router-link :to="{name: 'user-friends', params: {id: currentUser.id}}" class="navbar-item">
                    {{$t('navbar.my-friends')}}
                  </router-link>
                  <template v-if="isUserAdmin">
                    <hr class="navbar-divider">
                    <router-link :to="{name: 'user-validation'}" class="navbar-item">
                      {{$t('navbar.uservalidation')}}
                    </router-link>
                  </template>
                  <hr class="navbar-divider">
                  <router-link :to="{name: 'preferences'}" class="navbar-item">
                    {{$t('navbar.preferences')}}
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
  watch: {
    $route(){
      this.openedMenu = false;
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
@import "@/assets/colors.scss";
@import "~bulma/sass/utilities/mixins.sass";

.navbar-brand {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  img {
    max-height: 2.5em !important;
  }
}

.burger {
  color: $white;
}

.navbar-brand > .navbar-item.router-link-exact-active.is-active {
  background-color: transparent;
}

.navbar-dropdown > .navbar-item {
  color: $secondary;
}

@include desktop {
  .navbar-link-wrapper {
    padding: 0.75em;
  }

  .hero.is-dark-secondary a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .hero.is-dark-secondary strong {
    color: $secondary;
  }

  .hero.is-dark-secondary .navbar-item.has-dropdown .navbar-link-wrapper > .navbar-link.navbar-link-custom {
    color: $secondary;
    background-color: white;
    border-radius: 4px;
  }

  .navbar-link.navbar-link-custom > .icon {
    margin-right: .1875em;
  }

  .hero.is-dark-secondary .navbar-dropdown.is-boxed > .navbar-item {
    color: $secondary;
  }

  .hero.is-dark-secondary .navbar-dropdown.is-boxed > .navbar-item:hover {
    color: $secondary;
    background-color: white;
  }

  .hero.is-dark-secondary .navbar-dropdown.is-boxed > .navbar-item.is-active {
    color: $secondary;
    background-color: white;
  }
}

</style>
