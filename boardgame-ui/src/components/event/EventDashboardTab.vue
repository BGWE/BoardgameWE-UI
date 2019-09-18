<template>
  <div>
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    
    <div v-if="stats">
      <b-collapse class="eventList" :open="false" aria-id="statistics">
        <div slot="trigger" slot-scope="props" role="button" aria-controls="statistics">
          <h2 class="collapse-trigger-content subtitle">
            {{$t("home.statistics")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
          </h2>
        </div>

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
              <p>({{$tc('stats.count-times', stats.most_played.count)}})</p>
            </div>
            <div v-else>
              <p class="title"><i18n path="event.stats.none" /></p>
            </div>
          </div>
        </div>

      </b-collapse>
    </div>
    
    <hr>

    <div v-if="activities">
      <h2 class="subtitle"><i18n path="activity.title.recent-activities" /></h2>
      <activity-box v-for="index in activities.length" :key="index" :activity="activities[index-1]" />
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
import ActivityBox from '@/components/activities/ActivityBox';
import BgcDuration from '@/components/utils/BgcDuration';
import fab from 'vue-fab';

export default {
  components: {
    ActivityBox,
    BgcDuration,
    fab
  },
  props: ['event'],
  data() {
    return {
      loading: true,
      activities: [],
      stats: null,
      fabActions: [
        {
          name: 'add_game',
          icon: 'playlist_add',
          tooltip: 'Add game'
        },
        {
          name: 'create_timer',
          icon: 'add_alarm',
          tooltip: 'Create a timer'
        }
      ]
    };
  },

  methods: {
    add_game() {
      this.$router.push({name: 'add-game-event'});
    },
    create_timer() {
      this.$router.push({name: 'add-timer-event'});
    }
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
