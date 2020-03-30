<template>
  <div>
    <hero-title-page-layout :title="$t('games.title')" />
    <b-loading :is-full-page="false" :active="loading" />
    <add-edit-game-form v-if="!loading"
      class="form"
      :users="users"
      :boardgames="boardgames"
      :events="events"
    />
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import AddEditGameForm from '@/components/games/AddEditGameForm';
import BoardGame from '@/utils/api/BoardGame';
import Event from '@/utils/api/Event';

export default {
  components: {
    HeroTitlePageLayout,
    AddEditGameForm
  },
  data() {
    return {
      users: null,
      boardgames: null,
      events: null,
      loading: true
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  methods: {
    async fetchUsers() {
      this.users = await this.currentUser.fetchFriends();
    },
    async fetchBoardGames() {
      this.boardgames = await BoardGame.fetchAll();
    },
    async fetchEvents() {
      this.events = await Event.fetchAll(true, [this.currentUser.id]);
    }
  },
  async created() {
    await Promise.all([this.fetchUsers(), this.fetchBoardGames(), this.fetchEvents()]);
    this.loading = false;
  }
};
</script>

<style scoped>
.form {
  margin-top: 20px;
}
</style>
