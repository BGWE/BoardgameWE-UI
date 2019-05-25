<template>
  <div>
    <HeroTitlePageLayout :title="$t('events.title')"/>
    <section class="container">
      <b-loading :is-full-page="false" :active="isLoading"/>
      <div class="section">
        <div class="columns">
          <div class="column has-text-right">
            <router-link tag="button" class="button is-primary" :to="{name: 'create-event'}">
                {{$t("events.add")}}
            </router-link>
          </div>
        </div>

        <b-collapse :open="true" aria-id="activeEventsId">
          <div class="title" slot="trigger" slot-scope="props" role="button" aria-controls="activeEventsId">
            <h2>
              Active events <span class="icon is-small"><i :class="props.open ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></span>
            </h2>
          </div>

          <div class="columns events is-multiline">
            <div class="column is-one-quarter" v-for="event in currentEvents" :key="event.id">
              <EventCard :event="event" :attended-events="attendedEvents"/>
            </div>
          </div>
        </b-collapse>

        <b-collapse :open="false" aria-id="pastEventsId">
          <div class="title" slot="trigger" slot-scope="props" role="button" aria-controls="pastEventsId">
            <h2>
              Past events <span class="icon is-small"><i :class="props.open ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></span>
            </h2>
          </div>
          <div class="columns events is-multiline" >
            <div class="column is-one-quarter" v-for="event in pastEvents" :key="event.id">
              <EventCard :event="event" :attended-events="attendedEvents"/>
            </div>
          </div>
        </b-collapse>

      </div>
    </section>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import EventCard from '@/components/event/EventCard';
import Event from '@/utils/api/Event';
import moment from 'moment-timezone';

export default {
  components: {
    EventCard,
    HeroTitlePageLayout
  },

  data() {
    return {
      isLoading: true,
      events: [],
      attendedEvents: []
    };
  },

  methods: {
    async reload() {
      this.events = await Event.fetchAll();
      this.attendedEvents = await Event.fetchAttendedEvents();
      this.isLoading = false;
    },

    async joinEvent(eventId) {
      await Event.subscribeWithId(eventId);
      this.reload();
    }
  },

  computed: {
    currentEvents() {
      const today = moment().toISOString(true);
      return this.events.filter(event => event.end > today);
    },

    pastEvents() {
      const today = moment().toISOString(true);
      return this.events.filter(event => event.end <= today);
    }
  },

  async created() {
    this.isLoading = true;
    this.reload();
  }
};
</script>

<style scoped>
.events .column {
  display: flex;
}
</style>
