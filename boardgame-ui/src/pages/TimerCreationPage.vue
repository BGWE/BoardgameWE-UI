<template>
  <div>
    <HeroTitlePageLayout :title="$t('add-edit-timer.title')"/>
    <b-loading :active="isLoading"/>
    <section v-if="timer" class="section">

      <form @submit.prevent="createTimer('form-timerCreation')" data-vv-scope="form-timerCreation">

        <h2 class="subtitle">{{$t('add-edit-timer.timer.title')}}</h2>

        <b-field grouped group-multiline>
          <b-field :label="$t('add-edit-timer.timer.type')">
            <b-select v-model="timer.timer_type">
              <option v-for="method in timerTypeI18nPath" :value="method.type">
                {{$t(method.i18nPath)}}
              </option>
            </b-select>
          </b-field>

          <b-field :label="$t('add-edit-timer.timer.duration')">
            <b-numberinput min="0" controls-position="compact" v-model="timer.initial_duration"/>
          </b-field>

          <b-field v-if="timer.timer_type === 'RELOAD'" :label="$t('add-edit-timer.timer.reload-increment')">
            <b-numberinput min="0" controls-position="compact" v-model="timer.reload_increment"/>
          </b-field>
        </b-field>

        <h2 class="subtitle">{{$t('add-edit-game.players.title')}}</h2>

        <table class="table is-fullwidth">
          <thead>
          <tr>
            <th>{{$t('add-edit-game.players.user')}}</th>
            <th class="has-text-white">.</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(user, idx) in players" :key="user ? `user${user.id}` : idx">
            <td>
              <b-field
                :type="{'is-danger': errors.has(`user-${idx}`)}"
                :message="errors.first(`user-${idx}`)"
              >
                <user-autocomplete
                  size="is-small"
                  v-model="players[idx].user"
                  :users="allUsers"
                  :excludedIds="selectedUsersIds"
                  :name="`user-${idx}`"
                  :data-vv-as="$t('add-edit-game.players.user')"
                  v-validate="'required'"
                />
              </b-field>
            </td>
            <td>
              <button type="button" class="delete" @click="removePlayer(idx)"></button>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="has-text-centered">
              <button class="button is-small" type="button" @click="addPlayer()">
                {{$t('button.add-player')}}
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="buttons is-right">
          <button class="button" type="button" @click="$emit('close')">{{$t('button.cancel')}}</button>
          <button class="button is-primary">{{$t('button.save')}}</button>
        </div>

      </form>

    </section>
  </div>
</template>

<script>
import Timer, { TimerTypes } from '@/utils/api/Timer';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import UserAutocomplete from '@/components/form/UserAutocomplete';
import User from "../utils/api/User";

export default {
  name: 'TimerEditionPage',

  components: {
    HeroTitlePageLayout,
    UserAutocomplete
  },

  data() {
    return {
      isLoading: true,
      players: [],
      allUsers: null,
      timer: null,
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },

    selectedUsersIds() {
      return this.players.map(({user}) => user ? user.id : 0);
    },

    timerTypeI18nPath() {
      return [
        {type: TimerTypes.COUNT_UP, i18nPath: 'timer.type.count_up'},
        {type: TimerTypes.COUNT_DOWN, i18nPath: 'timer.type.count_down'},
        {type: TimerTypes.RELOAD, i18nPath: 'timer.type.reload'}
      ];
    }
  },

  methods: {
    addPlayer() {
      this.players.push({user: null});
    },

    removePlayer(idx) {
      if(this.players.length === 1) {
        this.$toast.open({
          message: this.$t('add-edit-game.must-have-at-least-one-player'),
          type: 'is-danger',
          position: 'is-bottom'
        });
        return;
      }
      this.players.splice(idx, 1);
    },

    async createTimer(scope) {
      let result = await this.validate(scope);

      if (!result) {
        return;
      }

      try {

      }
      catch (e) {
        console.log(e);
      }
    },

    async validate(scope) {
      let result = await this.$validator.validateAll(scope);

      if (!result) {
        this.$toast.open({
          message: this.$t('global.invalid-form'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }

      return result;
    }
  },

  async created() {
    this.allUsers = await User.fetchUsers();

    if (this.$route.params.timerid) {

    }
    else {
      this.timer = new Timer();
      this.timer.timer_type = TimerTypes.COUNT_UP;
      this.timer.initial_duration = 20;
      this.players.push({user: this.currentUser});
      this.timer.player_timers.push({id: this.currentUser.id});
    }

    this.isLoading = false;

  },
};
</script>

<style scoped>
</style>
