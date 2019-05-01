<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">

          <h1 class="title">
            <i18n path="home.hello"></i18n> {{currentUser.name}} !
            <span class="icon"><i class="hero-smile fa fa-smile"></i></span>
          </h1>
          <h2 class="subtitle">
            <i18n path="home.welcome">
              <i18n place="where" path="app.appName"></i18n>
            </i18n>
          </h2>
        </div>
      </div>
    </section>

    <div class="container">
      <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading>
      <section class="section" v-if="ongoingEvent">
        <router-link tag="button" class="button is-large is-fullwidth" :to="{name: 'event', params: {eventid: ongoingEvent.id}}">
          <p>{{ongoingEvent.name}}</p> <span class="icon"><i class="fa fa-arrow-right"></i></span>
        </router-link>
      </section>

      <section class="section" v-if=userStats>
        <div class="columns">
          <div class="column has-text-centered">
            <p class="heading"><i18n path="home.stats.owned" /></p>
            <p class="title">{{userStats.owned}}</p>
          </div>

          <div class="column has-text-centered">
            <p class="heading"><i18n path="home.stats.played" /></p>
            <p class="title">{{userStats.played}}</p>
          </div>

          <div class="column has-text-centered">
            <p class="heading"><i18n path="home.stats.attended" /></p>
            <p class="title">{{userStats.attended}}</p>
          </div>

          <div class="column has-text-centered" v-if="userStats.most_played.count > 0">
            <p class="heading"><i18n path="home.stats.most_played" /></p>
            <p class="title">{{userStats.most_played.board_game.name}}</p>
            <p>({{userStats.most_played.count}} <i18n path="home.stats.times" />)</p>
          </div>

          <div class="column has-text-centered" v-if="userStats.most_played.count > 0">
            <p class="heading"><i18n path="home.stats.time_played" /></p>
            <p class="title"><bgc-duration :duration="userStats.play_time" /></p>
          </div>
        </div>
      </section>

      <section class="section" v-if="userActivities">
        <h2 class="subtitle"><i18n path="home.recent-activities" /></h2>
        <activity-box v-for="index in userActivities.length" :key="index" :activity="userActivities[index-1]" />
      </section>
    </div>
  </div>

</template>

<script>
import Event from '@/utils/api/Event';
import User from '@/utils/api/User';
import ActivityBox from '@/components/activities/ActivityBox';
import BgcDuration from '@/components/utils/BgcDuration';

export default {
  name: 'UserHomePage',
  data() {
    return {
      userStats: null,
      userActivities: null,
      ongoingEvent: null,
      isFetching: true
    };
  },
  components: {
    ActivityBox,
    BgcDuration
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  async created() {
    const id = this.currentUser.id;
    this.userStats = await User.fetchStats(id);
    this.userActivities = await User.fetchActivities(id);
    let ongoingEvents = await Event.fetchAll(true, [id]);
    if (ongoingEvents.length > 0) {
      this.ongoingEvent = ongoingEvents[0];
    }
    this.isFetching = false;
  }
};
</script>

<style scoped>
  .hero-smile {
    font-size: 25px;
  }

  .button {
    margin-top: 20px;
  }

  .section {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .column > .title {
    margin-bottom: 5px;
  }
</style>
