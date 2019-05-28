import Vue from 'vue';
import App from './App.vue';
import './assets/style.scss';

import i18n from './i18n';

import VueRouter from 'vue-router';

import moment from 'moment';
moment.locale(window.navigator.userLanguage || window.navigator.language || 'en');
moment.tz.setDefault(moment.tz.guess());

import router from './router';
Vue.use(VueRouter);

import store from './store';

import Buefy from 'buefy';
Vue.use(Buefy, {defaultIconPack: 'fas'});

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate, {events: ''});

import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_API;

import VueYoutube from 'vue-youtube';
Vue.use(VueYoutube);

import VueSocketIO from 'vue-socket.io-extended';
import io from 'socket.io-client';
Vue.use(VueSocketIO, io(process.env.VUE_APP_API, {autoConnect: false}), {store});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  i18n,
  router,
  store
}).$mount('#app');
