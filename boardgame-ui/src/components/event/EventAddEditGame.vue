<template>
  <div class="wrapper">
    <add-edit-game-form
      :users="users"
      :boardgames="boardGames"
      :event="event"
    />
  </div>
</template>

<script>
import Event from '@/utils/api/Event';
import AddEditGameForm from '@/components/AddEditGameForm';

export default {
  components: {
    AddEditGameForm
  },
  props: {
    event: Event,
  },
  data() {
    return {
      boardGamesLinks: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    idGame() {
      return this.$route.params.idGame;
    },
    idTimer() {
      return this.$route.query.idTimer;
    },
    boardGames() {
      if(!this.boardGamesLinks) {
        return [];
      }

      let processedIds = [];
      let boardGames = [];
      for (let link of this.boardGamesLinks) {
        let id = link.id_board_game;
        if (!processedIds.includes(id)) {
          boardGames.push(link.provided_board_game);
          processedIds.push(id);
        }
      }
      return boardGames;
    },
    users() {
      return this.event.attendees.map(attendee => attendee.user);
    }
  },
  async created() {
    this.boardGamesLinks = await this.event.fetchBoardGames();
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 600px;
  min-height: 20vh;
  margin: auto;
  position: relative;
}
</style>
