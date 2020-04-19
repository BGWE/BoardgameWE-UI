<template>
  <div class="activity-container">
    <article class="media">
      <ActivityBoxLeftMedia :activity="activity" :thumbnail="thumbnail"/>
      <div class="media-content">
        <i18n v-if="activity.type === Types.EVENT_ADD_GAME" path="activity.event.add_game">
          <template #gameName>
            <strong><board-game-link :boardGame="activity.board_game" /></strong>
          </template>
          <template #userName>
            <strong><user-link :user="activity.user" /></strong>
          </template>
        </i18n>

        <i18n v-else-if="activity.type === Types.EVENT_PLAY_GAME" path="activity.event.play_game">
          <template #playerNames>
            <player-list :players="activity.game.players" />
          </template>
          <template #gameName>
            <strong><game-link :game="activity.game" /></strong>
          </template>
        </i18n>

        <i18n v-else-if="activity.type === Types.EVENT_USER_JOIN" path="activity.event.user_join">
          <template #userName>
            <strong><user-link :user="activity.user" /></strong>
          </template>
        </i18n>

        <i18n
          v-else-if="activity.type === Types.USER_JOIN_EVENT"
          :path="isCurrentUser ? 'activity.current_user.join_event' : 'activity.user.join_event'"
        >
          <template #userName>
            <span>{{targetUser.name}}</span>
          </template>

          <template #eventName>
            <strong><router-link :to="{name: 'event', params: {eventid: activity.event.id}}">{{activity.event.name}}</router-link></strong>
          </template>
        </i18n>

        <i18n
          v-else-if="activity.type === Types.USER_LIBRARY_ADD"
          :path="isCurrentUser ? 'activity.current_user.library_add' : 'activity.user.library_add'"
        >
          <template #userName>
            <span>{{targetUser.name}}</span>
          </template>
          <template #gameName>
            <strong><board-game-link :boardGame="activity.board_game" /></strong>
          </template>
        </i18n>

        <i18n
          v-else-if="activity.type === Types.USER_PLAY_GAME"
          :path="isCurrentUser ? 'activity.current_user.play_game' : 'activity.user.play_game'"
        >
          <template #userName>
            <span>{{targetUser.name}}</span>
          </template>
          <template #gameName>
            <strong><board-game-link :boardGame="activity.board_game" /></strong>
          </template>
        </i18n>

        <br />
        <bgc-datetime :datetime="activity.datetime" class="datetime-minor" />
      </div>
    </article>
  </div>
</template>

<script>
import BgcDatetime from '@/components/layout/BgcDatetime';
import ActivityBoxLeftMedia from '@/components/activities/ActivityBoxLeftMedia';
import PlayerList from '@/components/activities/PlayerList';
import BoardGameLink from '@/components/board_games/BoardGameLink';
import GameLink from '@/components/games/GameLink';
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
    UserLink,
    GameLink
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
</style>
