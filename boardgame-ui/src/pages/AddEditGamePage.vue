<template>
  <div>
    <HeroTitlePageLayout :title="$t('games.title')"/>
    <add-edit-game-form v-if="!isLoading"
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
      users: [],
      boardgames: [],
      events: [],
      isLoading: true
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  async created() {
    this.users = await this.currentUser.fetchFriends();
    this.boardgames = await BoardGame.fetchAll();
    this.events = await Event.fetchAll(true, [this.currentUser.id]);
    this.isLoading = false;
  }
};
</script>

<style scoped>
.form {
  margin-top: 20px;
}
</style>
