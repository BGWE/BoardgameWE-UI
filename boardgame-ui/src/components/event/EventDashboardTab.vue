<template>
  <section class="tabwrapper">
    <div class="section" v-if="stats">
      <h2 class="subtitle"><i18n path="home.statistics" /></h2>
      <div class="columns">
        <div class="column has-text-centered">
          <p class="heading"><i18n path="event.stats.distinct_played" /></p>
          <p class="title">{{stats.board_games_played}}</p>
        </div>

        <div class="column has-text-centered">
          <p class="heading"><i18n path="event.stats.played" /></p>
          <p class="title">{{stats.games_played}}</p>
        </div>

        <div class="column has-text-centered">
          <p class="heading"><i18n path="event.stats.provided_board_games" /></p>
          <p class="title">{{stats.provided_board_games}} </p>
        </div>
      </div>

      <div class="columns">
        <div class="column has-text-centered" >
          <p class="heading"><i18n path="event.stats.longest_game" /></p>
          <div v-if="stats.longest_game">
            <p class="title">{{stats.longest_game.board_game.name}}</p>
            <p>(<bgc-duration :duration="stats.longest_game.duration" />)</p>
          </div>
          <div v-else>
            <p class="title"><i18n path="event.stats.none" /></p>
          </div>
        </div>

        <div class="column has-text-centered">
          <p class="heading"><i18n path="event.stats.time_played" /></p>
          <p class="title"><bgc-duration :duration="stats.minutes_played || 0" /></p>
        </div>

        <div class="column has-text-centered">
          <p class="heading"><i18n path="event.stats.most_played" /></p>
          <div v-if="stats.most_played.board_game">
            <p class="title">{{stats.most_played.board_game.name}}</p>
            <p>({{stats.most_played.count}} <i18n path="home.stats.times" />)</p>
          </div>
          <div v-else>
            <p class="title"><i18n path="event.stats.none" /></p>
          </div>
        </div>
      </div>
    </div>

    <div class="section" v-if="activities">
      <h2 class="subtitle"><i18n path="home.recent-activities" /></h2>
      <activity-box v-for="index in activities.length" :key="index" :activity="activities[index-1]" />
    </div>
  </section>
</template>

<script>
import ActivityBox from '@/components/activities/ActivityBox';
import BgcDuration from '@/components/utils/BgcDuration';

export default {
  components: {
    ActivityBox,
    BgcDuration
  },
  props: ['event'],
  data() {
    return {
      loading: true,
      activities: [],
      stats: null
    };
  },
  async created() {
    this.loading = true;
    this.activities = await this.event.fetchActivities();
    this.stats = await this.event.fetchStats();
    this.loading = false;
  }
};
</script>


<style scoped>
.title {
  margin-bottom: 0.25rem;
}
</style>
