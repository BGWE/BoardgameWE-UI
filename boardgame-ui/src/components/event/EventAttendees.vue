<template>
  <div class="tabwrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <div class="columns" v-if="!loading">
      <div class="column is-full">
        <p v-if="isAttendeeOrCreator" class="has-text-right limited-width">
          <!-- Disabled because page not yet implemented -->
          <router-link disabled :to="{name: 'add-attendees'}" class="button is-primary"> {{$t('event.attendees.invite')}} </router-link>
        </p>

        <div class="limited-width">
          <router-link
            v-for="attendee in event.attendees"
            :key="attendee.user.id"
            :to="{name: 'user-profile', params: {id: attendee.user.id}}">
              <div class="card user-card">
                <div class="card-content">
                  {{attendee.user.name}}
                </div>
                <footer class="card-footer">
                  <p class="card-footer-item">
                    <i18n path="event.attendees.joined">
                      <bgc-datetime place="datetime" :datetime="attendee.createdAt"></bgc-datetime>
                    </i18n>
                  </p>
                </footer>
              </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Event from '@/utils/api/Event';
import BgcDatetime from '@/components/layout/BgcDatetime';

export default {
  components: {BgcDatetime},
  props: {
    event: Event
  },

  data() {
    return {
      loading: false
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    isAttendeeOrCreator() {
      return this.isAttendee || this.event.id_creator === this.currentUser.id;
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

.user-card {
  border: 1px #f2f2f2 solid;
  margin-bottom: 5px;
}

.card-footer {
  font-size: 0.7em;
}
</style>
