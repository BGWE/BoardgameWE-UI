<template>
  <div>
    <HeroTitlePageLayout :title="$t('timer.add-edit.title')"/>
    <add-timer-form v-if="users"
      class="form"
      :users="users"
      @timerCreated="goBackToTimers"
      @close="goBackToTimers"
    />
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import AddTimerForm from '@/components/timer/AddTimerForm';

export default {
  components: {
    HeroTitlePageLayout,
    AddTimerForm
  },

  data() {
    return {
      users: null
    };
  },

  async created() {
    this.users = await this.$store.state.currentUser.fetchFriends();
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
