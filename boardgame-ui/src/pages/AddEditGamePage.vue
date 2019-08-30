<template>
  <div>
    <HeroTitlePageLayout :title="$t('add-game.title')"/>
    <add-edit-game-form v-if="users"
      :users="users"
      :boardgames="boardgames"
    />
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import AddEditGameForm from '@/components/AddEditGameForm';
import BoardGame from '@/utils/api/BoardGame';

export default {
  components: {
    HeroTitlePageLayout,
    AddEditGameForm
  },
  data() {
    return {
      users: [],
      boardgames: []
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
  }
};
</script>

<style scoped>
</style>
