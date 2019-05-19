<template>
  <div>
    <HeroTitlePageLayout :title="$t('timers.title')"/>
    <div class="container">
      <section class="section">
        <div class="columns">
          <div class="column has-text-right">
            <router-link tag="button" class="button is-primary" :to="{name: 'createtimer'}">
              {{$t("timers.add")}}
            </router-link>
          </div>
        </div>
        <timer-list 
          :timers="this.timers" 
          @delete:timer="timerDeleted"
        />
      </section>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import TimerList from '@/components/timer/TimerList';
import Timer from '@/utils/api/Timer';

export default {
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
  },

  methods: {
    timerDeleted(id_timer) {
      this.timers = this.timers.filter(t => t.id !== id_timer);
    }
  }
};
</script>

<style scoped>
</style>
