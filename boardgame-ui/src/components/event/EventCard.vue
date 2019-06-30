<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{event.name}}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <b-tag type="is-info">{{$t(visibilityToI18n(event.visibility))}}</b-tag> <br/>
        <b-tag v-if="event.current.is_requester" type="is-info">{{$t('event.pending_join_request')}}</b-tag> <br/>
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
    <footer class="card-footer" v-if="event.current.can_read || event.current.can_join || event.current.can_request || event.current.is_creator">
      <div class="buttons">
        <router-link v-if="event.current.can_read" :to="{name: 'event', params: {eventid: event.id}}" class="button is-primary">
          <span class="icon is-small">
            <i class="far fa-eye"></i>
          </span>

          <span>{{$t('events.view')}}</span>
        </router-link>

        <button class="button is-primary is-outlined" v-if="event.current.can_join" @click="join()">
          <span class="icon is-small">
            <i class="fas fa-sign-in-alt"></i>
          </span>

          <span>{{$t('events.join')}}</span>
        </button>
        <button class="button is-primary is-outlined" v-else-if="event.current.can_request" @click="requestAccess()">
          <span class="icon is-small">
            <i class="far fa-paper-plane"></i>
          </span>

          <span>{{$t('events.request')}}</span>
        </button>

        <router-link v-if="event.current.is_creator" :to="{name: 'edit-event', params: {eventid: event.id}}" class="button is-info is-outlined">
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
import Event, {EventVisibility} from '@/utils/api/Event';

export default {
  props: {
    event: Event
  },

  methods: {
    async join() {
      await Event.joinWithId(this.event.id);
      this.$emit('join:event', this.event.id);
    },
    async requestAccess() {
      await this.event.sendJoinRequest();
      this.$emit('request:event', this.event.id);
    },
    visibilityToI18n(visibility) {
      return {
        [EventVisibility.PUBLIC]: 'event.visibility.public',
        [EventVisibility.PRIVATE]: 'event.visibility.private',
        [EventVisibility.SECRET]: 'event.visibility.secret'
      }[visibility];
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
