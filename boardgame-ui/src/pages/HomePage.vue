<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{$t('home.hello')}} {{ currentUser ? currentUser.name : "" }} !
            <span class="icon">
              <i class="hero-smile fa fa-smile" />
            </span>
          </h1>
          <h2 class="subtitle">
            {{$t('home.welcome')}} {{$t('app.appName')}}.
          </h2>
        </div>
      </div>
    </section>

    <div v-if="currentUser">
      <section class="section" v-if="ongoingEvent">
        <router-link tag="button" class="button is-large is-fullwidth" :to="{name: 'event', params: {eventid: ongoingEvent.id}}">
          <p>Ongoing: {{ongoingEvent.name}}</p> <span class="icon"><i class="fa fa-arrow-right"/></span>
        </router-link>
      </section>

      <section class="section">
        <div class="columns">
          <div class="column has-text-centered">
            <p class="heading">{{$t('home.stats.owned')}}</p>
            <p class="title">{{userStats.owned}}</p>
          </div>

          <div class="column has-text-centered">
            <p class="heading">{{$t('home.stats.played')}}</p>
            <p class="title">{{userStats.played}}</p>
          </div>

          <div class="column has-text-centered">
            <p class="heading">{{$t('home.stats.attended')}}</p>
            <p class="title">{{userStats.attended}}</p>
          </div>

          <div class="column has-text-centered" v-if="userStats.most_played.count > 0">
            <p class="heading">{{$t('home.stats.most_played')}}</p>
            <p class="title">{{userStats.most_played.board_game.name}}</p>
            <p>({{userStats.owned}} {{$t('home.stats.times')}})</p>
          </div>

          <div class="column has-text-centered" v-if="userStats.most_played.count > 0">
            <p class="heading">{{$t('home.stats.time_played')}}</p>
            <p class="title">{{userStats.play_time}} {{$t('home.stats.minutes')}}</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="subtitle">{{$t('home.recent-activities')}}</h2>
        <div class="box">
          <p>Played a lot...</p>
        </div>

        <div class="box">
          <p>Played a lot...</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Event from '@/utils/api/Event';
import User from '@/utils/api/User';

export default {
  name: 'HomePage',
  data() {
    return {
      userStats: null,
      ongoingEvent: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  async created() {
    if (!this.currentUser) {
      return;
    }
    this.userStats = await User.fetchStats(this.currentUser.id);
    let ongoingEvents = await Event.fetchAll(true, true);
    if (ongoingEvents.length > 0) {
      this.ongoingEvent = ongoingEvents[0];
    }
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
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .level {
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
  }

  .column > .title {
    margin-bottom: 5px;
  }
</style>
