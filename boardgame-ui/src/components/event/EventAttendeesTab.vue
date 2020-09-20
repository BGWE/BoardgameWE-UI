<template>
  <div class="tabwrapper">
    <div class="columns">
      <div class="column is-full">
        <b-loading :is-full-page="false" :active="loading" />
        <section class="section limited-width" v-if="attendees" >
          <b-collapse class="userList" :open="true" aria-id="eventAttendees">
            <div slot="trigger" slot-scope="props" role="button" aria-controls="eventAttendees">
              <h2 class="collapse-trigger-content subtitle">
                {{$t("event.tab.attendees")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
              </h2>
            </div>

            <div v-if="attendees.length > 0" class="columns attendees is-multiline">
              <b-table :data="attendees" striped>
                <template slot-scope="props">
                  <b-table-column field="name" :label="$t('label.name')">
                    {{ props.row.user.name }}
                  </b-table-column>

                  <b-table-column field="surname" :label="$t('label.surname')">
                    {{ props.row.user.surname }}
                  </b-table-column>

                  <b-table-column field="username" :label="$t('label.username')">
                    {{ props.row.user.username }}
                  </b-table-column>

                  <b-table-column field="createdAt" :label="$t('event.attendees.joined-on')">
                    <bgc-datetime :datetime="props.row.createdAt"></bgc-datetime>
                  </b-table-column>

                  <b-table-column field="createdAt" :label="$t('event.attendees.host')">
                    <span class='tag is-success' v-if="event.id_creator == props.row.user.id">
                        <i18n path='global.yes'></i18n>
                    </span>
                  </b-table-column>

                  <b-table-column field="profile" :label="$t('label.profile')" centered>
                    <router-link :to="{name: 'user-profile', params: {id: props.row.user.id}}">
                      <span class="icon">
                        <i class="far fa-user-circle"></i>
                      </span>
                    </router-link>
                  </b-table-column>
                </template>
              </b-table>
            </div>

            <p class="has-text-grey" v-else>{{$t('event.no-attendee')}}</p>
          </b-collapse>
        </section>

        <div v-if="event.current.can_write">
          <section class="section limited-width">
            <validation-observer v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(inviteUser)">
                <validation-provider
                  rules="required"
                  v-slot="{ errors }"
                  :name="$t('add-edit-game.players.user')"
                >
                  <b-field
                    :label="$t('event.invite_someone')"
                    :type="{'is-danger': errors[0]}"
                    :message="errors"
                  >
                    <user-autocomplete
                      size="is-small"
                      v-model="invitee"
                      :users="friends"
                      :excludedIds="userIdsExcludedFromInvites"
                    />
                  </b-field>
                </validation-provider>
                <div class="buttons is-right">
                  <button class="button is-primary">{{$t('events.invite')}}</button>
                </div>
              </form>
            </validation-observer>
          </section>

          <section class="section limited-width" v-if="invitees">
            <b-collapse class="userList" :open="true" aria-id="invitesId">
              <div slot="trigger" slot-scope="props" role="button" aria-controls="invitesId">
                <h2 class="collapse-trigger-content subtitle">
                  {{$t("event.invites")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
                </h2>
              </div>

              <div v-if="invitees.length > 0" class="columns invitees is-multiline" >
                <b-table :data="invitees" striped>
                  <template slot-scope="props">
                    <b-table-column field="name" :label="$t('label.name')">
                      {{ props.row.invitee.name }}
                    </b-table-column>

                    <b-table-column field="surname" :label="$t('label.surname')">
                      {{ props.row.invitee.surname }}
                    </b-table-column>

                    <b-table-column field="username" :label="$t('label.username')">
                      {{ props.row.invitee.username }}
                    </b-table-column>

                    <b-table-column field="profile" :label="$t('label.profile')" centered>
                      <router-link :to="{name: 'user-profile', params: {id: props.row.invitee.id}}">
                        <span class="icon">
                          <i class="far fa-user-circle"></i>
                        </span>
                      </router-link>
                    </b-table-column>

                    <b-table-column field="action" :label="$t('label.status')" centered>
                      <div v-if="props.row.status === InviteStatus.ACCEPTED">
                        <span class='tag is-success'>{{$t('event.invite.status_accepted')}}</span>
                      </div>
                      <div v-else-if="props.row.status === InviteStatus.PENDING">
                        <span class='tag is-info'>{{$t('event.invite.status_pending')}}</span>
                      </div>
                      <div v-else>
                        <span class='tag is-danger'>{{$t('event.invite.status_rejected')}}</span>
                      </div>
                    </b-table-column>
                  </template>
                </b-table>
              </div>

              <p class="has-text-grey" v-else>{{$t('event.no-invites')}}</p>
            </b-collapse>
          </section>

          <section class="section limited-width" v-if="joinRequests">
            <b-collapse class="userList" :open="true" aria-id="joinRequestsId">
              <div slot="trigger" slot-scope="props" role="button" aria-controls="joinRequestsId">
                <h2 class="collapse-trigger-content subtitle">
                  {{$t("event.join_requests")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
                </h2>
              </div>

              <div v-if="joinRequests.length > 0" class="columns join_requests is-multiline">
                <b-table :data="joinRequests" striped>
                  <template slot-scope="props">
                    <b-table-column field="name" :label="$t('label.name')">
                      {{ props.row.requester.name }}
                    </b-table-column>

                    <b-table-column field="surname" :label="$t('label.surname')">
                      {{ props.row.requester.surname }}
                    </b-table-column>

                    <b-table-column field="username" :label="$t('label.username')">
                      {{ props.row.requester.username }}
                    </b-table-column>

                    <b-table-column field="profile" :label="$t('label.profile')" centered>
                      <router-link :to="{name: 'user-profile', params: {id: props.row.requester.id}}">
                        <span class="icon">
                          <i class="far fa-user-circle"></i>
                        </span>
                      </router-link>
                    </b-table-column>

                    <b-table-column field="action" :label="$t('label.action')" centered>
                      <div v-if="props.row.status === JoinRequestStatus.PENDING">
                        <b-button class="action-button" type="is-success" @click="handleJoinRequest(props.row, true)"><span class="icon"><i class="fas fa-check"></i></span></b-button>
                        <b-button class="action-button" type="is-danger" @click="handleJoinRequest(props.row, false)"><span class="icon"><i class="fas fa-times"></i></span></b-button>
                      </div>
                      <div v-else-if="props.row.status === JoinRequestStatus.ACCEPTED">
                        <span class='tag is-success'>{{$t('event.join_request.status_accepted')}}</span>
                      </div>
                      <div v-else>
                        <span class='tag is-danger'>{{$t('event.join_request.status_rejected')}}</span>
                      </div>
                    </b-table-column>
                  </template>
                </b-table>
              </div>

              <p class="has-text-grey" v-else>{{$t('event.no-join-requests')}}</p>
            </b-collapse>
          </section>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Event, {JoinRequestStatus, InviteStatus} from '@/utils/api/Event';
import BgcDatetime from '@/components/layout/BgcDatetime';
import UserAutocomplete from '@/components/form/UserAutocomplete';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  components: {
    BgcDatetime,
    ValidationObserver,
    ValidationProvider,
    UserAutocomplete
  },

  props: {
    event: Event
  },

  data() {
    return {
      JoinRequestStatus,
      InviteStatus,
      loading: true,
      friends: [],
      invitee: null, // for search
      invitees: [],
      joinRequests: []
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    attendees() {
      return this.event.attendees;
    },
    userIdsExcludedFromInvites() {
      return this.attendees.map(a => a.user.id)
        .concat(this.invitees.map(i => i.invitee.id));
    }
  },

  methods: {
    async handleJoinRequest(request, accept) {
      await this.event.handleJoinRequest(request.id_requester, accept);
      this.fetchJoinRequests();
      this.updateAttendees();
    },
    async inviteUser() {
      // will only be called if user has write access
      this.loading = true;
      const invite = await this.event.sendInvite(this.invitee.id);
      let notif = null;
      if (invite.status === InviteStatus.PENDING) {
        notif = {message: this.$t('event.invite_sent'), type: 'is-info'};
      }
      else if (invite.status === InviteStatus.ACCEPTED) {
        notif = {message: this.$t('event.invite_accepted'), type: 'is-success'};
        this.updateAttendees();
      }
      await this.fetchInvites();

      // reset field
      this.invitee = null;
      this.loading = false;

      // notify
      this.$buefy.notification.open(notif);
    },
    updateAttendees() {
      this.$emit('update-attendees');
    },
    async fetchInvites() {
      this.invitees = await this.event.fetchInvites();
    },
    async fetchJoinRequests() {
      this.joinRequests = await this.event.fetchJoinRequests();
    },
    async fetchFriends() {
      this.friends = await this.currentUser.fetchFriends();
    }
  },

  async created() {
    if (this.event.current.can_write) { // only need to fetch data if user has rights to do so
      await Promise.all([
        this.fetchInvites(),
        this.fetchJoinRequests(),
        this.fetchFriends()
      ]);
    }
    this.loading = false;
  }
};
</script>

<style scoped>
.limited-width {
  max-width: 650px;
  margin: auto;
  margin-bottom: 1em;
}

.attendees .column {
  display: flex;
}

.collapse-trigger-content {
  padding-bottom: 0.5rem;
}

.userList {
  margin-bottom: 1rem;
}

.user-card {
  border: 1px #f2f2f2 solid;
  margin-bottom: 5px;
}

.card-footer {
  font-size: 0.7em;
}

.action-button {
  margin-left: 3px;
}
</style>
