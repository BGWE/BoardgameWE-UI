<template>
  <div v-if="user && user.id === idUser">
    <hero-title-page-layout :tabs="tabs">
      <div class="columns">
        <div class="column is-narrow"><h1 class="title">{{title}}</h1></div>
        <div v-if="!isCurrentUserProfile" class="column">
          <b-dropdown v-if="user.current.is_friend" hoverable>
            <template #trigger>
              <button class="button is-dark-secondary">
                <span class="icon">
                  <i class="fas fa-check"></i>
                </span>
                <span>{{$t('profile.friend')}}</span>
              </button>
            </template>

            <b-dropdown-item @click="confirmModal = true">
              {{$t('profile.remove-from-friends')}}
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown v-else-if="user.current.has_sent_friendship_request" hoverable>
            <template #trigger>
              <button class="button is-dark-secondary">
                <span class="icon">
                  <i class="fas fa-user-clock"></i>
                </span>
                <span>{{$t('profile.friendship-request-sent')}}</span>
              </button>
            </template>

            <b-dropdown-item @click="cancelRequest()">
              {{$t('profile.cancel-friendship-request')}}
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown v-else-if="user.current.has_received_friendship_request" hoverable>
            <template #trigger>
              <button class="button is-dark-secondary">
                <span class="icon">
                  <i class="fas fa-user-check"></i>
                </span>
                <span>{{$t('profile.friendship-request-received')}}</span>
              </button>
            </template>

            <b-dropdown-item @click="answerRequest(true)">
              {{$t('profile.accept-friendship-request')}}
            </b-dropdown-item>
            <b-dropdown-item @click="answerRequest(false)">
              {{$t('profile.reject-friendship-request')}}
            </b-dropdown-item>
          </b-dropdown>

          <button class="button is-dark-secondary" v-else @click="addFriend">
            <span class="icon">
              <i class="fas fa-user-plus"></i>
            </span>
            <span>{{$t('profile.add-friend')}}</span>
          </button>
        </div>
      </div>
    </hero-title-page-layout>

    <div class="container">
      <div class="section">
        <router-view v-if="canViewProfile" :user="user" :isCurrentUserProfile="isCurrentUserProfile" />
        <p v-else>
          {{$t('profile.not-friend')}}
        </p>
      </div>
    </div>

    <confirm-delete-modal
      :active="confirmModal"
      :onDelete="removeFriend"
      :onCancel="() => confirmModal = false"
      :content="$t('profile.confirm-friend-deletion')"
      :confirmLabel="$t('label.confirm')"
    />
  </div>
</template>

<script>
import User from '@/utils/api/User';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';

export default {
  components: {
    HeroTitlePageLayout,
    ConfirmDeleteModal
  },

  data() {
    return {
      user: null,
      confirmModal: false,

    };
  },

  computed: {
    idUser() {
      return Number(this.$route.params.id);
    },
    currentUser() {
      return this.$store.state.currentUser;
    },
    isCurrentUserProfile() {
      return this.idUser === this.currentUser.id;
    },
    title() {
      if(this.isCurrentUserProfile) {
        return this.$t('profile.title.your-profile');
      }
      else {
        return this.$t('profile.title.profile-of', {user: `${this.user.name} ${this.user.surname[0]}.`});
      }
    },
    canViewProfile() {
      return this.isCurrentUserProfile || this.user.current.is_friend;
    },
    tabs() {
      if(this.canViewProfile) {
        return [
          {name: 'user-profile', text: this.$t('profile.tab.dashboard'), exact: true},
          {name: 'user-library', text: this.$t('profile.tab.library')},
          {name: 'user-wish-list', text: this.$t('profile.tab.wish-list')},
          {name: 'user-friends', text: this.$t('profile.tab.friends')},
        ];
      }
      else {
        return null;
      }
    }
  },

  watch: {
    idUser() {
      this.fetchUser();
    }
  },

  methods: {
    async fetchUser() {
      this.user = await User.fetch(this.idUser);
    },
    async removeFriend() {
      try {
        await User.removeFriend(this.user.id);
        this.fetchUser();
      }
      catch(error) {
        console.log(error);
        this.showError('profile.toast.remove-friend-error');
      }
      this.confirmModal = false;
    },
    async addFriend() {
      try {
        await User.sendFriendshipRequest(this.user.id);
        this.fetchUser();
      }
      catch(error) {
        console.log(error);
        this.showError('profile.toast.add-friend-error');
      }
    },
    async answerRequest(accept) {
      try {
        await User.handleFriendshipRequest(this.user.id, accept);
        this.fetchUser();
      }
      catch(error) {
        console.log(error);
        this.showError('profile.toast.handle-friend-request-error');
      }
    },
    async cancelRequest() {
      try {
        await User.cancelFriendshipRequest(this.user.id);
        this.fetchUser();
      }
      catch(error) {
        console.log(error);
        this.showError('profile.toast.cancel-friend-request-error');
      }
    },
    showError(label) {
      this.$toast.open({
        message: this.$t(label),
        type: 'is-danger',
        position: 'is-bottom'
      });
    }
  },

  created() {
    this.fetchUser();
  }
};
</script>

<style scoped>

</style>
