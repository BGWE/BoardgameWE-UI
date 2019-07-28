<template>
  <div v-if="user && user.id === idUser">
    <hero-title-page-layout :title="title" :tabs="tabs" />

    <div class="container">
      <div class="section">
        <router-view :user="user" :isCurrentUserProfile="isCurrentUserProfile" />
      </div>
    </div>
  </div>
</template>

<script>
import User from '@/utils/api/User';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';

export default {
  components: {
    HeroTitlePageLayout,
  },

  data() {
    return {
      user: null
    };
  },

  computed: {
    tabs() {
      return [
        {name: 'user-profile', text: this.$t('profile.tab.dashboard'), exact: true},
        {name: 'user-library', text: this.$t('profile.tab.library')},
        {name: 'user-wish-list', text: this.$t('profile.tab.wish-list')},
        {name: 'user-achievements', text: this.$t('profile.tab.achievements')}
      ];
    },
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
    }
  },

  created() {
    this.fetchUser();
  }
};
</script>

<style scoped>

</style>
