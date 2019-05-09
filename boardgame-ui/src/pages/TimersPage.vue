<template>
  <div>
    <HeroTitlePageLayout :title="$t('timers.title')"/>
    <section class="section">

      <div class="columns">
        <div class="column has-text-right">
          <router-link tag="button" class="button is-primary" :to="{name: 'createtimer'}">
            {{$t("timers.add")}}
          </router-link>
        </div>
      </div>

      <div class="columns is-centered">
        <div class="column">
          <router-link 
            tag="div"
            class="box timer-box"
            v-for="timer in timers" 
            v-bind:key="timer.id"
            :to="{name: 'timer', params: {timerid: timer.id}}">

            <article class="media">
              <div class="media-left" v-if="timer.game !== null">
                <figure class="image is-64x64">
                  <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
                </figure>
              </div>
              
              <div class="media-content">
                <div class="content">
                  <b-taglist>
                    <b-tag 
                      rounded
                      type="is-info"
                      size="is-small"
                      v-for="player in timer.player_timers"
                      v-bind:key="player.id">{{getPlayerName(player)}}</b-tag>
                  </b-taglist>
                </div>
                
                <nav class="level is-mobile-small-device">
                  <div class="level-left">
                    <p class="is-size-7"><i18n path="timers.timer"/> | {{timer.id}}</p>
                  </div>

                  <div class="level-item is-hidden-small-device">
                    <p class="is-size-7">{{elapsedFromNow(mostRecentPlayer(timer.player_timers).updatedAt)}}</p>
                  </div>

                  <div class="level-right">
                    <p class="is-size-7"><i18n path="timers.created-by"/> <span class="name"> {{isCurrentUserTimerCreator(timer.creator.id) ? $t('timers.creator.you') : timer.creator.name}}</span></p>
                  </div>
                </nav>
              </div>

              <div class="media-right is-vertical-center is-media-right">
                <span>
                  <i class="fas fa-chevron-right"></i>
                </span>
              </div>
            </article>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import Timer from '@/utils/api/Timer';
import * as helper from '@/utils/helper';

import moment from 'moment';
import { iso8601ToMoment } from '@/utils/helper';

export default {
  name: 'TimersPage',

  components: {
    HeroTitlePageLayout
  },

  data() {
    return {
      data: [],
      columns: [
        { field: 'id', label: 'ID', numeric: true },
        { field: 'board_game', label: 'Board game', center: true },
        { field: 'creator', label: 'Creator', center: true },
        { field: 'createdAt', label: 'Created at' }
      ],
      timers: null
    };
  },
  async created() {
    this.timers = await Timer.getCurrentUserTimers();
  },
  methods: {
    timerSelected(timer) {
      this.$router.push({ name: 'timer', params: { timerid: timer.id } });
    },

    isCurrentUserTimerCreator(timerCreatorId) {
      let currentUser = this.$store.state.currentUser;
      return currentUser.id == timerCreatorId;
    },

    getPlayerName(player) {
      return player.name !== null ? player.name : player.user.name;
    },

    elapsedBetween(timeSinceMoment, timeReferenceMoment) {
      return timeReferenceMoment.diff(timeSinceMoment);
    },

    mostRecentPlayer(playersTimer) {
      let now = moment().tz(moment.tz.guess());

      return playersTimer.reduce((min_p, p) => {
        let p_diff = this.elapsedBetween(p.updatedAt, now);
        return p_diff < this.elapsedBetween(min_p.updatedAt, now) ? p : min_p;
      }, playersTimer[0]);
    },

    elapsedFromNow(sinceTime) {
      return iso8601ToMoment(sinceTime).from(moment().tz(moment.tz.guess()));
    }
  }
};
</script>

<style scoped>
.name {
  font-style: italic;
}

.timer-box {
  padding-top: 15px;
  padding-bottom: 15px;

  max-width: 600px;
  margin: auto;
  margin-bottom: 1em;
}

.is-vertical-center {
  display: flex;
  align-items: center;
}

.is-media-right {
  margin-left: 2em;
}

@media (max-width: 400px) {
  .is-hidden-small-device {
    display: none !important;
  }

  .is-mobile-small-device {
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
  }
}

@media (min-width: 400px) {
  .is-hidden-small-device {
    margin-bottom: 0px;
  }

  .is-mobile-small-device {
    display: flex;
  }
}

</style>
