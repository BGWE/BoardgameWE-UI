
import VueRouter from 'vue-router';
import store from './store';

const guestOnly = async (to, from, next) => {
  await store.dispatch('initializeStore');

  if (store.state.currentUser == null) {
    next();
    return;
  }
  next({name: 'home'});
};

const authenticatedOnly = async (to, from, next) => {
  await store.dispatch('initializeStore');

  if(store.state.currentUser != null) {
    next();
    return;
  }
  next({name: 'login', query: {next: to.fullPath}});
};

const routes = [
  {
    name: 'home',
    path: '/',
    component: require('./pages/HomePage.vue').default,
  },
  {
    name: 'login',
    path: '/login/:next?',
    component: require('./pages/LoginPage.vue').default,
    beforeEnter: guestOnly
  },
  {
    name: 'register',
    path: '/register',
    component: require('./pages/LoginPage.vue').default,
    beforeEnter: guestOnly
  },
  {
    name: 'events',
    path: '/events',
    component: require('./pages/EventsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'event',
    path: '/event/:eventid',
    component: require('./pages/EventPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'library',
    path: '/library',
    component: require('./pages/LibraryPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'preferences',
    path: '/preferences',
    component: require('./pages/PrefsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'not-found',
    path: '*',
    component: require('./pages/NotFoundPage.vue').default,
  },
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

export default router;
