<template>
  <div>
    <HeroTitlePageLayout :title="$t('timers.title')"/>
    <section class="container">
      <b-loading :is-full-page="false" :active="isLoading"/>

      <div class="section">
        <b-message v-if="timers.length === 0" type="is-info" has-icon icon-size="is-small">
          {{ $t('event.timers.info-message')}}
        </b-message>
    
        <div class="columns">
          <div class="column has-text-right">
            <router-link tag="button" class="button is-primary" :to="{name: 'create-timer'}">
              {{$t("timers.add")}}
            </router-link>
          </div>
        </div>
        
        <timer-list v-if="timers"
          :timers="this.timers"
          @delete:timer="timerDeleted"
        />
      </div>
    </section>
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
      timers: null,
      isLoading: true
    };
  },

  async created() {
    this.timers = await Timer.getCurrentUserTimers();
    this.isLoading = false;
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
