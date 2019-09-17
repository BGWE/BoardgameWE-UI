<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <b-collapse class="eventList" :open="false" aria-id="statistics">
        <div slot="trigger" slot-scope="props" role="button" aria-controls="statistics">
          <h2 class="collapse-trigger-content subtitle">
            {{$t("home.statistics")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
          </h2>
        </div>
        <div class="columns stats">
          <div class="column has-text-centered">
            <p class="heading">{{$t('stats.owned')}}</p>
            <p class="title">{{stats.owned}}</p>
          </div>

          <div class="column has-text-centered">
            <p class="heading">{{$t('stats.played')}}</p>
            <p class="title">{{stats.played}}</p>
          </div>

          <div class="column has-text-centered">
            <p class="heading">{{$t('stats.attended')}}</p>
            <p class="title">{{stats.attended}}</p>
          </div>

          <div class="column has-text-centered" v-if="stats.most_played.count > 0">
            <p class="heading">{{$t('stats.most_played')}}</p>
            <p class="title">{{stats.most_played.board_game.name}}</p>
            <p>({{$tc('stats.count-times', stats.most_played.count)}})</p>
          </div>

          <div class="column has-text-centered" v-if="stats.most_played.count > 0">
            <p class="heading">{{$t('stats.time_played')}}</p>
            <p class="title"><bgc-duration :duration="stats.play_time" /></p>
          </div>
        </div>
      </b-collapse>

      <hr class="simple-hr">

      <h2 class="subtitle">
        {{$t('activity.title.recent-activities')}}
      </h2>
      <activity-box v-for="activity in activities" :key="activity.id" :activity="activity" :targetUser="user" />
      <p v-if="activities.length === 0" class="has-text-grey">
        {{$t('activity.no-activities')}}
      </p>
    </template>
  </div>
</template>

<script>
import User from '@/utils/api/User';
import ActivityBox from '@/components/activities/ActivityBox';
import BgcDuration from '@/components/utils/BgcDuration';

export default {
  props: {
    user: User
  },
  components: {
    ActivityBox,
    BgcDuration
  },
  data() {
    return {
      loading: true,
      stats: null,
      activities: null
    };
  },
  methods: {
    async fetchStats() {
      this.stats = await User.fetchStats(this.user.id);
    },
    async fetchActivities() {
      this.activities = await User.fetchActivities(this.user.id);
    }
  },
  async created() {
    await Promise.all([
      this.fetchStats(),
      this.fetchActivities()
    ]);
    this.loading = false;
  }
};
</script>

<style scoped>
.stats .title {
  margin-bottom: 0.25rem;
}
</style>
