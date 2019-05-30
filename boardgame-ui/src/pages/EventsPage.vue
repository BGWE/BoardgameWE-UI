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

        <section class="section">
          <b-collapse class="eventList" :open="true" aria-id="activeEventsId">
            <div slot="trigger" slot-scope="props" role="button" aria-controls="activeEventsId">
              <h2 class="collapse-trigger-content subtitle">
                {{$t("events.active")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
              </h2>
            </div>

            <div v-if="currentEvents()" class="columns events is-multiline">
              <div class="column is-one-quarter" v-for="event in currentEvents()" :key="event.id">
                <EventCard :event="event" :attended-events.sync="attendedEvents"/>
              </div>
            </div>
            <p v-else>Sorry, there is currently no active event but if you are feeling lonely you can always <router-link :to="{name: 'create-event'}">create a new one</router-link> :)</p>
          </b-collapse>
        </section>

        <section class="section">
          <b-collapse class="eventList" v-if="pastEvents()" :open="false" aria-id="pastEventsId">
            <div slot="trigger" slot-scope="props" role="button" aria-controls="pastEventsId">
              <h2 class="collapse-trigger-content subtitle">
                {{$t("events.past")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
              </h2>
            </div>
            <div class="columns events is-multiline" >
              <div class="column is-one-quarter" v-for="event in pastEvents()" :key="event.id">
                <EventCard class="past" :event="event" :attended-events.sync="attendedEvents"/>
              </div>
            </div>
          </b-collapse>
        </section>

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
    currentEvents() {
      const today = moment().toISOString(false);
      return this.events.filter(event => event.end > today);
    },

    pastEvents() {
      const today = moment().toISOString(false);
      return this.events.filter(event => event.end <= today);
    }
  },

  async created() {
    this.events = await Event.fetchAll();
    this.attendedEvents = await Event.fetchAttendedEvents();
    this.isLoading = false;
  }
};
</script>

<style scoped>
.events .column {
  display: flex;
}

.eventList {
  margin-bottom: 1rem;
}

.collapse-trigger-content {
  padding-bottom: 0.5rem;
}

.past {
  color: grey;
}
</style>
