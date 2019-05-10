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

  if (store.state.currentUser != null) {
    next();
    return;
  }
  next({name: 'login', query: {next: to.fullPath}});
};

const adminOnly = async (to, from, next) => {
  await store.dispatch('initializeStore');

  if (store.state.currentUser != null && store.state.currentUser.admin === true) {
    next();
    return;
  }
  next({name: 'home'});
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
    component: require('./pages/RegisterPage.vue').default,
    beforeEnter: guestOnly
  },
  {
    name: 'events',
    path: '/events',
    component: require('./pages/EventsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'createevent',
    path: '/events/createEvent',
    component: require('./pages/EventCreationPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'event',
    path: '/event/:eventid',
    component: require('./pages/EventPage.vue').default,
    redirect: {name: 'event_dashboard'},
    beforeEnter: authenticatedOnly,
    children: [
      {
        name: 'event_dashboard',
        path: 'dashboard',
        component: require('./components/event/EventDashboardTab.vue').default,
      },
      {
        name: 'event_board_games',
        path: 'board_games',
        component: require('./components/event/EventBoardGamesTab.vue').default,
      },
      {
        name: 'event_games',
        path: 'games',
        component: require('./components/event/EventGamesTab.vue').default,
      },
      {
        name: 'event_rankings',
        path: 'rankings',
        component: require('./components/event/EventRankingsTab.vue').default,
      },
      {
        name: 'event_matchmaking',
        path: 'matchmaking',
        component: require('./components/event/EventMatchmakingTab.vue').default,
      }
    ]
  },
  {
    name: 'editEvent',
    path: '/event/:eventid/edit',
    component: require('./pages/EventCreationPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'library',
    path: '/library',
    component: require('./pages/LibraryPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'timers',
    path: '/timers',
    component: require('./pages/TimersPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'timer',
    path: '/timer/:timerid',
    component: require('./pages/TimerPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'createtimer',
    path: '/timers/edit?id=:id',
    component: require('./pages/TimerCreationPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'edittimer',
    path: '/timer/:timerid/edit',
    component: require('./pages/TimerCreationPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'test_timer',
    path: '/test_timer',
    component: require('./pages/TestTimer.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'preferences',
    path: '/preferences',
    component: require('./pages/PrefsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'uservalidation',
    path: '/userValidation',
    component: require('./pages/UserValidationPage.vue').default,
    beforeEnter: adminOnly
  },
  {
    name: 'boardgame',
    path: '/boardgame/:id',
    component: require('./pages/BoardGamePage.vue').default
  },
  {
    name: 'forgot-password',
    path: '/auth/forgot_password',
    component: require('./pages/ForgotPasswordPage.vue').default
  },
  {
    name: 'reset-password',
    path: '/auth/reset_password',
    component: require('./pages/ResetPasswordPage.vue').default
  },
  {
    name: 'not-found',
    path: '*',
    component: require('./pages/NotFoundPage.vue').default,
  },
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active'
});

export default router;
