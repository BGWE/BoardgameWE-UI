<template>
  <div>
    <HeroTitlePageLayout :title="$t('events.title')"/>

    <section class="section">
      <div class="columns">
        <div class="column has-text-right">
          <router-link tag="button" class="button is-primary" :to="{name: 'createEvent'}">
              {{$t("events.add")}}
          </router-link>
        </div>
      </div>

      <div class="columns is-multiline" >
        <div class="column is-one-quarter" v-for="event in events" :key="event.id">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                {{event.name}}
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                {{event.description}} <br>
                {{event.location}}
              </div>
            </div>
            <footer class="card-footer">
              <div class="buttons">
                <router-link :to="{name: 'event', params: {eventid: event.id}}" class="button is-light">
                  {{$t('events.view')}}
                </router-link>
                <button class="button" v-if="!isAttendedEvent(event.id)" @click="joinEvent(event.id)">{{$t('events.join')}}</button>
                <router-link v-if="isUserEventOwner(event.id_creator)" :to="{name: 'editEvent', params: {eventid: event.id}}" class="button is-danger">
                  {{$t('events.edit')}}
                </router-link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';

import Event from '@/utils/api/Event';

export default {
  components: {
    HeroTitlePageLayout
  },

  data() {
    return {
      events: [],
      attendedEvents: []
    };
  },

  methods: {
    async reload() {
      this.events = await Event.fetchAll();
      this.attendedEvents = await Event.fetchAttendedEvents();
    },

    isUserEventOwner(userId) {
      return (userId === this.$store.state.currentUser.id);
    },

    isAttendedEvent(eventId) {
      return this.attendedEvents.find(e => e.id == eventId);      
    },

    async joinEvent(eventId) {
      const data = await Event.subscribeWithId(eventId);
      this.reload();
    }
  },

  async created() {
    this.reload();
  }
};
</script>

<style scoped>
.column {
  display: flex;
}
.card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.card-content {
  flex-grow: 1;
}
.buttons {
  margin: auto;
  padding: 10px;
}
</style>
