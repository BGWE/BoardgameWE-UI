import Vue from 'vue';
import App from './App.vue';
import './assets/style.scss';

import i18n from './i18n';

import VueRouter from 'vue-router';
import router from './router';
Vue.use(VueRouter);

import store from './store';

import Buefy from 'buefy';
Vue.use(Buefy, {defaultIconPack: 'fas'});

import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_API;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  i18n,
  router,
  store
}).$mount('#app');
