<template>
  <div>
    <HeroTitlePageLayout :title="$t('games.title')"/>
    <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    <add-edit-game-form v-if="events"
      class="form"
      :users="users"
      :boardgames="boardgames"
      :events="events"
      @eventChange="onEventChange"
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
  methods: {
    async onEventChange(event) {
      this.loading = true;
      await this.fetchBoardGames(event);
      console.log(this.boardgames);
      this.loading = false;
    },
    async fetchBoardGames(event) {
      let bgs = [];
      if (event) {
        bgs = await event.fetchProvidedBoardGames();
      }
      else {
        bgs = await BoardGame.fetchAll();
      }
      this.boardgames = bgs;
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  async created() {
    this.users = await this.currentUser.fetchFriends();
    this.fetchBoardGames();
    this.events = await Event.fetchAll(true, [this.currentUser.id]);
    this.loading = false;
  }
};
</script>

<style scoped>
.form {
  margin-top: 20px;
}
</style>
