<template>
  <div class="activity-container">
    <article class="media">
      <ActivityBoxLeftMedia :activity="activity" :thumbnail="thumbnail"/>
      <div class="media-content" v-if="activity.type === Types.EVENT_ADD_GAME">
        <i18n path="activity.event.add_game">
          <strong place="gameName"><router-link :to="{name: 'boardgame', params: {id: activity.board_game.id}}">{{activity.board_game.name}}</router-link></strong>
          <strong place="userName">{{activity.user.name}}</strong>
        </i18n>
        <br/>
        <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
      </div>
      <div class="media-content" v-else-if="activity.type === Types.EVENT_PLAY_GAME">
        <i18n path="activity.event.play_game">
          <player-list place="playerNames" :players="activity.game.players"></player-list>
          <strong place="gameName"><router-link :to="{name: 'boardgame', params: {id: activity.game.board_game.id}}">{{activity.game.board_game.name}}</router-link></strong>
        </i18n>
        <br/>
        <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
      </div>
      <div class="media-content" v-else-if="activity.type === Types.EVENT_USER_JOIN">
        <i18n path="activity.event.user_join">
          <strong place="userName">{{activity.user.name}}</strong>
        </i18n>
        <br/>
        <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
      </div>
      <div class="media-content" v-else-if="activity.type === Types.USER_JOIN_EVENT">
        <i18n path="activity.user.join_event">
          <strong place="eventName"><router-link :to="{name: 'event', params: {eventid: activity.event.id}}">{{activity.event.name}}</router-link></strong>
        </i18n>
        <br/>
        <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
      </div>
      <div class="media-content" v-else-if="activity.type === Types.USER_LIBRARY_ADD">
        <i18n path="activity.user.library_add">
          <strong place="gameName"><router-link :to="{name: 'boardgame', params: {id: activity.board_game.id}}">{{activity.board_game.name}}</router-link></strong>
        </i18n>
        <br/>
        <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
      </div>
      <div class="media-content" v-else-if="activity.type === Types.USER_PLAY_GAME">
        <i18n path="activity.user.play_game">
          <strong place="gameName"><router-link :to="{name: 'boardgame', params: {id: activity.board_game.id}}">{{activity.board_game.name}}</router-link></strong>
        </i18n>
        <br/>
        <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
      </div>
    </article>
  </div>
</template>

<script>
import BgcDatetime from '@/components/layout/BgcDatetime';
import ActivityBoxLeftMedia from '@/components/activities/ActivityBoxLeftMedia';
import PlayerList from '@/components/activities/PlayerList';
import { ActivityTypes } from '@/utils/api/Activity';

export default {
  name: 'ActivityBox',
  components: { ActivityBoxLeftMedia, BgcDatetime, PlayerList },
  props: {
    activity: {
      required: true
    }
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
