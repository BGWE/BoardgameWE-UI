<template>
  <div class="tabwrapper">
    <section class="section" v-if="stats">
      <h2 class="subtitle"><i18n path="home.statistics" /></h2>
    </section>  

    <section class="section" v-if="activities">
      <h2 class="subtitle"><i18n path="home.recent-activities" /></h2>
      <activity-box v-for="index in activities.length" :key="index" :activity="activities[index-1]" />
    </section>  
  </div>
</template>

<script>
import BgcDatetime from '@/components/layout/BgcDatetime';
import ActivityBox from '@/components/activities/ActivityBox';

export default {
  components: {
    BgcDatetime,
    ActivityBox
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
