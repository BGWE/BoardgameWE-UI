<template>
  <div class="tabwrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <add-timer-form
      :event="event"
      :users="attendees"
      v-if="showTimerForm"
      @timerCreated="timerSaved"
      @close="showTimerForm = false"
    />
    
    <div class="columns" v-else-if="!loading">
      <div class="column is-full">
        <p v-if="isAttendee" class="has-text-right limited-width">
          <button class="button is-primary" @click="openTimerForm()">{{$t('timers.add')}}</button>
        </p>
        <timer-list :timers="timers" />
      </div>
    </div>
  </div>
</template>

<script>
import TimerList from '@/components/timer/TimerList';
import AddTimerForm from '@/components/timer/AddTimerForm';
import Event from '@/utils/api/Event';

export default {
  components: {TimerList, AddTimerForm},
  props: {
    event: {
      type: Event,
      required: true
    }, 
    isAttendee: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return  {
      timers: [],
      showTimerForm: false,
      loading: false
    };
  },
  computed: {
    attendees() {
      return this.event.attendees.map(attendee => attendee.user);
    }
  },
  created() {
    this.reload();
  },
  methods: {
    async reload() {
      this.loading = true;
      this.timers = await this.event.getCurrentUserTimers();
      this.loading = false;
    },
    timerSaved() {
      this.reload();
      this.showTimerForm = false;
    },
    openTimerForm() {
      this.showTimerForm = true;
    }
  }
};
</script>

<style scoped>

.limited-width {
  max-width: 500px;
  margin: auto;
  margin-bottom: 1em;
}
</style>
