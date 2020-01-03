<template>
  <div>
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <template v-if="!loading">
      <b-message  type="is-info" has-icon icon-size="is-small" v-if="timers.length === 0">
        {{$t('timers.info-message')}}
      </b-message>
      <b-message  type="is-info" has-icon icon-size="is-small" v-if="timers.length === 0">
        {{$t('timers.info-message-nowrite')}}
      </b-message>
      
      <div class="columns">
        <div class="column is-full">
          <p class="has-text-right limited-width">
            <router-link :to="{name: 'create-timer'}" class="button is-primary"> {{$t('timers.add')}} </router-link>
          </p>
          
          <timer-list :timers="timers" @delete:timer="timerDeleted"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TimerList from '@/components/timer/TimerList';
import Timer from '@/utils/api/Timer';
import User from '@/utils/api/User';

export default {
  components: { TimerList },

  props: {
    user: User
  },

  data() {
    return  {
      timers: [],
      loading: false
    };
  },

  async created() {
    this.loading = true;
    this.timers = await Timer.getCurrentUserTimers();
    this.loading = false;
  },

  methods: {
    timerDeleted(id_timer) {
      this.timers = this.timers.filter(t => t.id !== id_timer);
    }
  }
};
</script>

<style scoped>
.limited-width {
  max-width: 500px;
  margin: auto;
  margin-bottom: 1em;
}
</style>
