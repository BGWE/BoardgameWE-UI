import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import axios from 'axios';
import User from '@/utils/api/User';

const state = {
  currentUser: null,
  initialized: false,
  socketInitialized: false
};

const mutations = {
  setInitialized(state) {
    state.initialized = true;
  },

  setCurrentUser(state, user) {
    state.currentUser = user;
  },

  SOCKET_CONNECT() {
    let token = window.localStorage.accessToken;
    this._vm.$socket.emit('authenticate', {token});
  },

  SOCKET_AUTHENTICATED(state) {
    state.socketInitialized = true;
  },

  SOCKET_UNAUTHORIZED() {
    console.error('SOCKET_UNAUTHORIZED');
  }
};

const actions = {
  async initializeStore({state, commit, dispatch}) {
    if(state.initialized) {
      return;
    }

    let token = window.localStorage.accessToken;
    if(token == null) {
      return;
    }

    axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
    await dispatch('fetchUser');
    commit('setInitialized');
  },

  async login({dispatch}, {username, password}) {
    let token = await User.login(username, password);
    axios.defaults.headers.common['Authentication'] = `JWT ${token}`;
    window.localStorage.accessToken = token;
    dispatch('fetchUser');
  },

  async fetchUser({commit}) {
    let user = null;

    try {
      user = await User.fetchCurrent();
    }
    catch (e) {
      console.log('Error while fetching current user.');

      cleanAuthenticationState();
      this._vm.$socket.close();
      commit('setCurrentUser', null);
      return;
    }

    commit('setCurrentUser', user);

    if(user) {
      this._vm.$socket.open();
    }
  },

  logout({commit}) {
    cleanAuthenticationState();
    this._vm.$socket.close();
    commit('setCurrentUser', null);
  }
};

function cleanAuthenticationState() {
  delete axios.defaults.headers.common['Authentication'];
  window.localStorage.removeItem('accessToken');
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
