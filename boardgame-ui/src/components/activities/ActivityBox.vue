<template>
  <div class="activity-container">
    <article class="media">
      <ActivityBoxLeftMedia :activity="activity" :thumbnail="thumbnail"/>
      <div class="media-content">
        <i18n v-if="activity.type === Types.EVENT_ADD_GAME" path="activity.event.add_game">
          <strong place="gameName"><board-game-link :boardGame="activity.board_game" /></strong>
          <strong place="userName"><user-link :user="activity.user" /></strong>
        </i18n>

        <i18n v-else-if="activity.type === Types.EVENT_PLAY_GAME" path="activity.event.play_game">
          <player-list place="playerNames" :players="activity.game.players" />
          <strong place="gameName"><board-game-link :boardGame="activity.game.board_game" /></strong>
        </i18n>

        <i18n v-else-if="activity.type === Types.EVENT_USER_JOIN" path="activity.event.user_join">
          <strong place="userName"><user-link :user="activity.user" /></strong>
        </i18n>

        <i18n
          v-else-if="activity.type === Types.USER_JOIN_EVENT"
          :path="isCurrentUser ? 'activity.current_user.join_event' : 'activity.user.join_event'"
        >
          <span place="userName">{{targetUser.name}}</span>
          <strong place="eventName"><router-link :to="{name: 'event', params: {eventid: activity.event.id}}">{{activity.event.name}}</router-link></strong>
        </i18n>

        <i18n
          v-else-if="activity.type === Types.USER_LIBRARY_ADD"
          :path="isCurrentUser ? 'activity.current_user.library_add' : 'activity.user.library_add'"
        >
          <span place="userName">{{targetUser.name}}</span>
          <strong place="gameName"><board-game-link :boardGame="activity.board_game" /></strong>
        </i18n>

        <i18n
          v-else-if="activity.type === Types.USER_PLAY_GAME"
          :path="isCurrentUser ? 'activity.current_user.play_game' : 'activity.user.play_game'"
        >
          <span place="userName">{{targetUser.name}}</span>
          <strong place="gameName"><board-game-link :boardGame="activity.board_game" /></strong>
        </i18n>

        <br />
        <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
      </div>
    </article>
  </div>
</template>

<script>
import BgcDatetime from '@/components/layout/BgcDatetime';
import ActivityBoxLeftMedia from '@/components/activities/ActivityBoxLeftMedia';
import PlayerList from '@/components/activities/PlayerList';
import BoardGameLink from '@/components/board_games/BoardGameLink';
import UserLink from '@/components/user/UserLink';
import { ActivityTypes } from '@/utils/api/Activity';

export default {
  name: 'ActivityBox',
  props: {
    activity: {
      type: Object,
      required: true
    },
    targetUser: {type: Object}
  },
  components: {
    ActivityBoxLeftMedia,
    BgcDatetime,
    PlayerList,
    BoardGameLink,
    UserLink
  },
  data() {
    return { Types: ActivityTypes };
  },
  computed: {
    thumbnail() {
      switch (this.activity.type) {
        case ActivityTypes.EVENT_PLAY_GAME:
          return this.activity.game.board_game.thumbnail;
        case ActivityTypes.EVENT_ADD_GAME:
        case ActivityTypes.USER_PLAY_GAME:
        case ActivityTypes.USER_LIBRARY_ADD:
          return this.activity.board_game.thumbnail;
        case ActivityTypes.EVENT_USER_JOIN:
        case ActivityTypes.USER_JOIN_EVENT:
        default:
          return null;
      }
    },
    currentUser() {
      return this.$store.state.currentUser;
    },
    isCurrentUser() {
      return this.targetUser.id === this.currentUser.id;
    }
  }
};
</script>

<style scoped>
.activity-container {
    margin-top: 5px;
    margin-bottom: 5px;
}

.activity-datetime {
    color: #000000;
    font-size: 0.8em;
}
</style>
