<template>
  <div>
    <HeroTitlePageLayout :title="$t('timer.add-edit.title')"/>
    <add-timer-form 
      class="form"
      @timerCreated="goBackToTimers"
      @close="goBackToTimers" 
    />
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import AddTimerForm from '@/components/timer/AddTimerForm';

export default {
  name: 'TimerEditionPage',

  components: {
    HeroTitlePageLayout,
    AddTimerForm
  },

  methods: {
    goBackToTimers() {
      this.$router.push({name: 'timers'});
    }
  }
};
</script>

<style scoped>
.form {
  margin-top: 20px;
}
</style>
