<template>
    <div v-if=activity class="activity-container">
        <article class="media" v-if="activity.type === 'event/join'">
            <div class="media-left calendar-media-left">
                <figure class="image is-64x64"><span><i class="fa-3x far fa-calendar-alt"></i></span></figure>
            </div>
            <div class="media-content">
                <i18n path="activity.event.join">
                  <strong place="eventName">
                    <router-link :to="{name: 'event', params: {eventid: activity.event.id}}">
                      {{activity.event.name}}
                    </router-link>
                  </strong>
                </i18n>.
                <br/>
                <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
            </div>
        </article>
        <article class="media" v-if="activity.type === 'game/play'">
            <div class="media-left">
                <figure class="image is-64x64 is-rounded" :style="{backgroundImage: `url('${activity.board_game.thumbnail}')`}">
                </figure>
            </div>
            <div class="media-content">
                <i18n path="activity.game.played">
                  <strong place="gameName">
                    <router-link :to="{name: 'boardgame', params: {id: activity.board_game.id}}">
                      {{activity.board_game.name}}
                    </router-link>
                  </strong>
                </i18n>.
                <br/>
                <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
            </div>
        </article>
        <article class="media" v-if="activity.type === 'library/add'">
            <div class="media-left">
                <figure class="image is-64x64 is-rounded" :style="{backgroundImage: `url('${activity.board_game.thumbnail}')`}">
                </figure>
            </div>
            <div class="media-content">
                <i18n path="activity.library.added_game">
                  <strong place="gameName">
                    <router-link :to="{name: 'boardgame', params: {id: activity.board_game.id}}">
                      {{activity.board_game.name}}
                    </router-link>
                  </strong>
                </i18n>.
                <br/>
                <bgc-datetime :datetime="activity.datetime" class="activity-datetime" />
            </div>
        </article>
    </div>
    <div v-else-if=!activity></div>
</template>


<script>
import BgcDatetime from '@/components/layout/BgcDatetime';

export default {
  name: 'ActivityBox',
  components: {BgcDatetime},
  props: {
    activity: {
      required: true
    }
  },
};
</script>

<style scoped>
.activity-container {
    margin-top: 5px;
    margin-bottom: 5px;
    height: 64px;
}

.activity-datetime {
    color: #000000;
    font-size: 0.8em;
}

figure.image {
  text-align: center;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

figure.is-rounded {
  border-radius: 32px;
}
</style>
