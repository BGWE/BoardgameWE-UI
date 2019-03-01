
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
    component: require('./components/HomePage.vue').default,
  },
  {
    name: 'login',
    path: '/login/:next?',
    component: require('./components/LoginPage.vue').default,
    beforeEnter: guestOnly
  },
  {
    name: 'events',
    path: '/events',
    component: require('./components/EventsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'event',
    path: '/event/:eventid',
    component: require('./components/EventPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'library',
    path: '/library',
    component: require('./components/LibraryPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'preferences',
    path: '/preferences',
    component: require('./components/PrefsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'not-found',
    path: '*',
    component: require('./components/NotFoundPage.vue').default,
  },
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

export default router;
