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
    name: 'add-game',
    path: '/games/add',
    component: require('./pages/AddEditGamePage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'events',
    path: '/events',
    component: require('./pages/EventsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'create-event',
    path: '/events/create',
    component: require('./pages/EventCreationPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'event',
    path: '/event/:eventid',
    component: require('./pages/EventPage.vue').default,
    redirect: {name: 'event-dashboard'},
    beforeEnter: authenticatedOnly,
    children: [
      {
        name: 'event-dashboard',
        path: 'dashboard',
        component: require('./components/event/EventDashboardTab.vue').default,
      },
      {
        name: 'event-board-games',
        path: 'board-games',
        component: require('./components/event/EventBoardGamesTab.vue').default,
      },
      {
        name: 'add-game-event',
        path: 'games/add',
        component: require('./components/event/EventAddEditGame').default
      },
      {
        name: 'edit-game-event',
        path: 'games/edit/:idGame',
        component: require('./components/event/EventAddEditGame').default
      },
      {
        name: 'event-games',
        path: 'games',
        component: require('./components/event/EventGamesTab.vue').default
      },
      {
        name: 'event-rankings',
        path: 'rankings',
        component: require('./components/event/EventRankingsTab.vue').default,
      },
      {
        name: 'event-matchmaking',
        path: 'matchmaking',
        component: require('./components/event/EventMatchmakingTab.vue').default,
      },
      {
        name: 'event-timers',
        path: 'timers',
        component: require('./components/event/EventTimersTab.vue').default,
      },
      {
        name: 'add-timer-event',
        path: 'timers/add',
        component: require('./components/event/EventAddTimer').default
      },
      {
        name: 'event-attendees',
        path: 'attendees',
        component: require('./components/event/EventAttendeesTab').default
      }
    ]
  },
  {
    name: 'edit-event',
    path: '/event/:eventid/edit',
    component: require('./pages/EventCreationPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    path: '/user/:id',
    component: require('./pages/ProfilePage.vue').default,
    beforeEnter: authenticatedOnly,
    children: [
      {
        name: 'user-profile',
        path: '/',
        component: require('./components/user/UserActivity.vue').default
      },
      {
        name: 'user-library',
        path: 'library',
        component: require('./components/user/UserLibrary.vue').default
      },
      {
        name: 'user-wish-list',
        path: 'wishlist',
        component: require('./components/user/UserWishList.vue').default
      },
      {
        name: 'user-achievements',
        path: 'achievements',
        component: require('./components/user/UserAchievements.vue').default
      },
      {
        name: 'user-friends',
        path: 'friends',
        component: require('./components/user/UserFriends.vue').default
      }
    ]
  },
  // { // to be re-worked in version 3.1
  //   name: 'create-event-timer',
  //   path: '/event/:eventid/timer',
  //   component: require('./pages/TimerCreationPage.vue').default,
  //   beforeEnter: authenticatedOnly
  // },
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
    name: 'create-timer',
    path: '/timers/create',
    component: require('./pages/TimerCreationPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  // { // to be re-worked in version 3.1
  //   name: 'edit-timer',
  //   path: '/timer/:id/edit',
  //   component: require('./pages/TimerCreationPage.vue').default,
  //   beforeEnter: authenticatedOnly
  // },
  {
    name: 'preferences',
    path: '/preferences',
    component: require('./pages/PrefsPage.vue').default,
    beforeEnter: authenticatedOnly
  },
  {
    name: 'user-validation',
    path: '/user-validation',
    component: require('./pages/UserValidationPage.vue').default,
    beforeEnter: adminOnly
  },
  {
    name: 'board-game',
    path: '/board-game/:id',
    component: require('./pages/BoardGamePage.vue').default
  },
  {
    name: 'forgot-password',
    path: '/auth/forgot-password',
    component: require('./pages/ForgotPasswordPage.vue').default
  },
  {
    name: 'reset-password',
    path: '/auth/reset-password',
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
