<template>
  <div>
    <hero-title-page-layout>
      <h1 class="title">
        <i18n path="home.hello"></i18n> {{currentUser.name}} !
        <span class="icon"><i class="hero-smile fa fa-smile"></i></span>
      </h1>
      <h2 class="subtitle">
        <i18n path="home.welcome">
          <i18n place="where" path="app.appName"></i18n>
        </i18n>
      </h2>
    </hero-title-page-layout>

    <div class="container">
      <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading>
      <section class="section ongoing-event-message" v-if="ongoingEvent && isOngoingEventMsgActive">
        <!-- <router-link tag="button" class="button is-large is-fullwidth" :to="{name: 'event', params: {eventid: ongoingEvent.id}}">
          <p>{{ongoingEvent.name}}</p> <span class="icon"><i class="fa fa-arrow-right"></i></span>
        </router-link> -->
        <b-message :title="ongoingEvent.name" type="is-info" has-icon :active.sync="isOngoingEventMsgActive" aria-close-label="Close message">
          <!-- <p></p> <span class="icon"><i class="fa fa-arrow-right"></i></span> -->
          <!-- This event is currently ongoing. Click <router-link :to="{name: 'event', params: {eventid: ongoingEvent.id}}">here</router-link> to view. -->
          <i18n path="home.ongoing-event">
            <!-- <i18n place="here">rr</i18n> -->
            <router-link :to="{name: 'event', params: {eventid: ongoingEvent.id}}" place="here"><i18n path="home.here"></i18n></router-link>
          </i18n>
        </b-message>
      </section>

      <section class="section" v-if=userStats>
        <user-activity :user="currentUser" />
      </section>
    </div>

    <fab
      position="bottom-right"
      bg-color="#E66E50"
      :actions="fabActions"
      @create_timer="create_timer"
      @add_game="add_game"
    />
  
  </div>

</template>

<script>
import Event from '@/utils/api/Event';
import User from '@/utils/api/User';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import UserActivity from '@/components/user/UserActivity';
import fab from 'vue-fab';

export default {
  name: 'UserHomePage',
  data() {
    return {
      userStats: null,
      userActivities: null,
      ongoingEvent: null,
      isOngoingEventMsgActive: true,
      isFetching: true,
      fabActions: [
        {
          name: 'add_game',
          icon: 'playlist_add'
        },
        {
          name: 'create_timer',
          icon: 'add_alarm'
        }
      ]
    };
  },
  components: {
    HeroTitlePageLayout,
    UserActivity,
    fab
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  methods: {
    add_game() {
      this.$router.push({name: 'add-game'});
    },
    create_timer() {
      this.$router.push({name: 'create-timer'});
    }
  },
  async created() {
    const id = this.currentUser.id;
    this.userStats = await User.fetchStats(id);
    this.userActivities = await User.fetchActivities(id);
    let ongoingEvents = await Event.fetchAll({ongoing: true, registered: true});
    if (ongoingEvents.length > 0) {
      this.ongoingEvent = ongoingEvents[0];
    }
    this.isFetching = false;
  }
};
</script>

<style scoped>
.ongoing-event-message {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.hero-smile {
  font-size: 25px;
}
</style>
