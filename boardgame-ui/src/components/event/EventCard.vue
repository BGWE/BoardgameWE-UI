<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{event.name}}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        {{event.description}}
      </div>
    </div>
    <div class="location">
      <span class="icon">
        <i class="fas fa-location-arrow"></i>
      </span>
      <span class="is-size-6 location-text">
        {{event.location}}
      </span>
    </div>
    <footer class="card-footer">
      <div class="buttons">
        <router-link :to="{name: 'event', params: {eventid: event.id}}" class="button is-primary">
          <span class="icon is-small">
            <i class="far fa-eye"></i>
          </span>

          <span>{{$t('events.view')}}</span>
        </router-link>

        <button class="button is-primary is-outlined" v-if="!isAttendedEvent(event.id)" @click="joinEvent(event.id)">
          <span class="icon is-small">
            <i class="fas fa-sign-in-alt"></i>
          </span>

          <span>{{$t('events.join')}}</span>
        </button>

        <router-link v-if="isUserEventOwner(event.id_creator)" :to="{name: 'edit-event', params: {eventid: event.id}}" class="button is-info is-outlined">
          <span class="icon is-small">
            <i class="far fa-edit"></i>
          </span>

          <span>{{$t('events.edit')}}</span>
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  props: {
    event: Object,
    attendedEvents: Array
  },

  methods: {
    isUserEventOwner(userId) {
      return (userId === this.$store.state.currentUser.id);
    },

    isAttendedEvent(eventId) {
      return this.attendedEvents.find(e => e.id === eventId);
    },

    async joinEvent(eventId) {
      await Event.subscribeWithId(eventId);
      this.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

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
  padding-top: 0.75em;
  padding-bottom: 0.4em;
  padding-left: 0.7em;
}

.location {
  padding-left: 1.5em;
  padding-right: 1.5em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  border-top: 1px solid $grey-lighter;

  font-style: italic;
}
.location-text {}
</style>
