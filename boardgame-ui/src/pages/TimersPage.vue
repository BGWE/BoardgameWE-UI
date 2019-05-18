<template>
  <div>
    <HeroTitlePageLayout :title="$t('timers.title')"/>
    <timer-list :timers="this.timers" />
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import TimerList from '@/components/timer/TimerList';
import Timer from '@/utils/api/Timer';

export default {
  name: 'TimersPage',
  components: {
    HeroTitlePageLayout,
    TimerList
  },
  data() {
    return {
      timers: null
    };
  },
  async created() {
    this.timers = await Timer.getCurrentUserTimers();
  }
};
</script>

<style scoped>
</style>
