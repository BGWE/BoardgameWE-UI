<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />

    <template v-if="!loading">
      <b-message v-if="friends.length === 0 && isCurrentUserProfile" type="is-info" has-icon icon-size="is-small">
        {{ $t('profile.friends.explanation')}}
      </b-message>

      <p class="has-text-centered has-text-grey" v-if="friends.length === 0">
        {{$t('profile.no-friends')}}
      </p>
      <b-table :data="friends" striped>
        <template #default="{row: user}">
          <b-table-column :label="$t('label.name')">
            {{ user.name }}
          </b-table-column>

          <b-table-column :label="$t('label.surname')">
            {{ user.surname }}
          </b-table-column>

          <b-table-column :label="$t('label.username')">
            {{ user.username }}
          </b-table-column>

          <b-table-column :label="$t('label.profile')" centered>
            <router-link :to="{name: 'user-profile', params: {id: user.id}}">
              <span class="icon">
                <i class="far fa-user-circle"></i>
              </span>
            </router-link>
          </b-table-column>
        </template>
      </b-table>
      
      <template v-if="requests && requests.length">
        <hr>

        <h2 class="subtitle">{{$t('profile.pending-friend-requests')}}</h2>

        <div class="columns is-multiline">
          <div class="column is-narrow" v-for="request in requests" :key="request.id">
            <div class="card">
              <div class="card-content">
                <div class="content">
                  {{request.user_from.name}} {{request.user_from.surname}} ({{request.user_from.username}})
                  <i18n path="profile.friend_request_received_on" tag="p" class="is-size-7 has-text-grey">
                    <template v-slot:date>
                      <bgc-datetime :asdate="true" :datetime="request.createdAt" />
                    </template>
                  </i18n>

                </div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item" @click="answerRequest(request.id_user_from, true)">
                  {{$t('label.accept')}}
                </a>
                <a class="card-footer-item" @click="answerRequest(request.id_user_from, false)">
                  {{$t('label.reject')}}
                </a>
              </footer>
            </div>
          </div>
        </div>
      </template>

      <template v-if="ownRequests && ownRequests.length">
        <hr>

        <h2 class="subtitle">{{$t('profile.pending-own-friend-requests')}}</h2>

        <div class="columns is-multiline">
          <div class="column is-narrow" v-for="request in ownRequests" :key="request.id">
            <div class="card">
              <div class="card-content">
                <div class="content">
                  {{request.user_to.name}} {{request.user_to.surname}} ({{request.user_to.username}})
                  <i18n path="profile.friend_request_sent_on" tag="p" class="is-size-7 has-text-grey">
                    <template v-slot:date>
                      <bgc-datetime :asdate="true" :datetime="request.createdAt" />
                    </template>
                  </i18n>
                  <footer class="card-footer">
                    <a class="card-footer-item" @click="deleteRequest(request.id_user_to)">
                      {{$t('label.cancel')}}
                    </a>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </template>
  </div>
</template>

<script>
import User from '@/utils/api/User';
import BgcDatetime from '@/components/layout/BgcDatetime';

export default {
  props: {
    user: User,
    isCurrentUserProfile: Boolean
  },
  components: {
    BgcDatetime
  },
  data() {
    return {
      loading: true,
      friends: null,
      requests: null,
      ownRequests: null
    };
  },
  methods: {
    async fetchData() {
      await Promise.all([
        this.fetchFriends(),
        this.fetchRequests(),
        this.fetchOwnRequests()
      ]);
    },
    async fetchFriends() {
      this.friends = await this.user.fetchFriends();
    },
    async fetchRequests() {
      if(this.isCurrentUserProfile) {
        this.requests = await User.fetchCurrentFriendshipRequests();
      }
    },
    async fetchOwnRequests() {
      if (this.isCurrentUserProfile) {
        this.ownRequests = await User.fetchCurrentSentFriendshipRequests();
      }
    },
    async answerRequest(idUser, accept) {
      try {
        await User.handleFriendshipRequest(idUser, accept);
        this.fetchData();
      }
      catch(error) {
        console.log(error);
        this.$buefy.toast.open({
          message: this.$t('profile.toast.handle-friend-request-error'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }
    },
    async deleteRequest(idUser) {
      try {
        await User.cancelFriendshipRequest(idUser);
        this.fetchData();
      }
      catch (error) {
        console.log(error);
        this.$buefy.toast.open({
          message: this.$t('profile.toast.handle-friend-request-error'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }
    }
  },
  async created() {
    await this.fetchData();
    this.loading = false;
  }
};
</script>

<style scoped>
.card {
  width: 20em;
}
</style>
