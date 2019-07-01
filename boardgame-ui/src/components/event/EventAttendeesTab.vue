<template>
  <div class="tabwrapper">
    <div class="columns">
      <div class="column is-full">
        <b-loading :is-full-page="false" :active="loading"></b-loading>
        <section class="section limited-width" v-if="attendees && !loading" >
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

            <p v-else>No attendee.</p>
          </b-collapse>
        </section>

        <div v-if="event.current.can_write">
          <section class="section limited-width">
            <form @submit.prevent="inviteUser()">
                <b-field
                  :label="$t('event.invite_someone')"
                  :type="{'is-danger': errors.has('invitee')}"
                  :message="errors.first('invitee')"
                >
                  <user-autocomplete
                    size="is-small"
                    v-model="invitee"
                    :users="friends"
                    :excludedIds="userIdsExcludedFromInvites"
                    :name="'invitee'"
                    :data-vv-as="$t('add-edit-game.players.user')"
                    v-validate="'required'"
                  />
                </b-field>
                <div class="buttons is-right">
                  <button class="button is-primary">{{$t('events.invite')}}</button>
                </div>
            </form>
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

              <p v-else>No invites.</p>
            </b-collapse>
          </section>

          <section class="section limited-width" v-if="join_requests">
            <b-collapse class="userList" :open="true" aria-id="joinRequestsId">
              <div slot="trigger" slot-scope="props" role="button" aria-controls="joinRequestsId">
                <h2 class="collapse-trigger-content subtitle">
                  {{$t("event.join_requests")}}<span class="icon is-medium"><i :class="props.open ? 'fas fa-angle-down' : 'fas fa-angle-up'"></i></span>
                </h2>
              </div>

              <div v-if="join_requests.length > 0" class="columns join_requests is-multiline">
                <b-table :data="join_requests" striped>
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

              <p v-else>No join requests.</p>
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

export default {
  components: {BgcDatetime, UserAutocomplete},
  props: {
    event: Event
  },

  data() {
    return {
      JoinRequestStatus,
      InviteStatus,
      loading: false,
      friends: [],
      invitee: null, // for search
      invitees: [],
      attendees: [],
      join_requests: [],
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },

    userIdsExcludedFromInvites() {
      return this.attendees.map(a => a.user.id)
        .concat(this.invitees.map(i => i.invitee.id));
    }
  },

  methods: {
    async handleJoinRequest(request, accept) {
      await this.event.handleJoinRequest(request.id_requester, accept);
      await this.updateJoinRequests();
    },
    async updateLists() {
      this.attendees = await this.event.fetchAttendees();
      if (this.event.current.can_write) { // only someone with write access can eventually update request statuses
        this.friends = await this.$store.state.currentUser.getCurrentUserFriends();
        this.join_requests = await this.event.fetchJoinRequests();
        this.updateInvites();
      }
    },
    async inviteUser() {
      // will only be called if user has write access
      this.loading = true;
      const invite = await this.event.sendInvite(this.invitee.id);
      let notif = null;
      if (invite.status === InviteStatus.PENDING) {
        notif = {message: this.$t('event.invite_sent'), type: 'is-info'};
        await this.updateInvites();
      } 
      else if (invite.status === InviteStatus.ACCEPTED) {
        notif = {message: this.$t('event.invite_accepted'), type: 'is-success'};
        await this.updateLists();
      }
      // reset field 
      this.invitee = null;

      this.loading = false;
      
      // notify
      this.$notification.open(notif);
    },
    async updateInvites() {
      this.invitees = await this.event.fetchInvites();
    }
  },

  async created() {
    this.loading = true;
    await this.updateLists();
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
