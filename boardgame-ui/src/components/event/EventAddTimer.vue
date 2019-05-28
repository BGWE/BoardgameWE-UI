<template>
  <add-timer-form
    :event="event"
    :users="attendees"
    @created:timer="$router.go(-1)"
    @close="$router.go(-1)">
  </add-timer-form>
</template>

<script>
import Event from '@/utils/api/Event';
import AddTimerForm from '@/components/timer/AddTimerForm';

export default {
  components: {
    AddTimerForm
  },

  props: {
    event: Event,
  },

  computed: {
    attendees() {
      return this.event.attendees.map(attendee => attendee.user);
    }
  }
};
</script>

<style scoped>

</style>
