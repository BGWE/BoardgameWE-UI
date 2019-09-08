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
import AddEditGameForm from '@/components/games/AddEditGameForm';

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

h2 {
  margin-bottom: 0.5em !important;
  text-align: center;
}

/deep/ .timepicker .dropdown-content {
  padding-top: 0 !important;
  padding-bottom: 0 !important;

  select {
    font-weight: normal !important;
  }
}

/deep/ label {
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.7em;
}

th:nth-child(2), td:nth-child(2) {
  text-align: center;

  /deep/ .control {
    max-width: 10em;
    margin: auto;
  }
}
</style>
