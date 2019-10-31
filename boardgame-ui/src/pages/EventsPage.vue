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

          <b-collapse class="eventList" :open="true" aria-id="activeEventsId">
            <div slot="trigger" slot-scope="props" role="button" aria-controls="activeEventsId">
              <h2 class="collapse-trigger-content subtitle">
                {{$t("events.active")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></span>
              </h2>
            </div>

            <div v-if="currentEvents.length > 0" class="columns events is-multiline">
              <div class="column is-one-quarter" v-for="event in currentEvents" :key="event.id">
                <EventCard :event="event" @join:event="refresh" @request:event="refresh" />
              </div>
            </div>

            <p v-else>
              <i18n path="events.none.text">
                <router-link place="link" :to="{name: 'create-event'}"> {{ $t("events.none.link") }} </router-link>
              </i18n>
            </p>
          </b-collapse>
        
        <hr>

          <b-collapse class="eventList" v-if="pastEvents.length > 0" :open="false" aria-id="pastEventsId">
            <div slot="trigger" slot-scope="props" role="button" aria-controls="pastEventsId">
              <h2 class="collapse-trigger-content subtitle">
                {{$t("events.past")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i></span>
              </h2>
            </div>
            <div class="columns events is-multiline">
              <div class="column is-one-quarter" v-for="event in pastEvents" :key="event.id">
                <EventCard class="past" :event="event" @join:event="refresh" @request:event="refresh" />
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
import moment from 'moment-timezone';
import Event from '@/utils/api/Event';

export default {
  components: {
    EventCard,
    HeroTitlePageLayout
  },


  data() {
    return {
      isLoading: true,
      events: [],
    };
  },

  computed: {
    currentEvents() {
      const today = moment().toISOString(false);
      let filteredEvents = this.events.filter(event => event.end > today);
      return filteredEvents;
    },

    pastEvents() {
      const today = moment().toISOString(false);
      return this.events.filter(event => event.end <= today);
    }
  },

  methods: {
    async refresh() {
      this.isLoading = true;
      this.events = await Event.fetchAll({});
      this.isLoading = false;
    }
  },

  async created() {
    await this.refresh();
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
