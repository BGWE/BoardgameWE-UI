<template>
  <div>
    <HeroTitlePageLayout :title="$t('timers.title')"/>
    <div class="container">
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
              v-for="timer in timers"
              v-bind:key="timer.id"
              :to="{name: 'timer', params: {timerid: timer.id}}">
              <div class="box timer-box">

                <article class="media">
                  <div class="media-left">
                    <figure v-if="timer.board_game !== null" class="image is-64x64 is-rounded thumbnail" :style="{backgroundImage: `url('${timer.board_game.thumbnail}')`}"></figure>
                    <figure v-else class="image is-64x64 is-rounded thumbnail">
                      <img :src="require('@/assets/stopwatch-icon.svg')" />
                    </figure>
                  </div>

                  <div class="media-content">

                    <nav class="level is-mobile-small-device header-level">
                      <div class="level-left">
                        <p class="is-size-7"><i18n v-bind:path="timerTypeI18nPathMap[timer.timer_type]"/> | {{timer.id}}</p>
                      </div>

                      <div class="level-item is-hidden-small-device">
                        <p class="is-size-7">{{elapsedFromNow(mostRecentPlayer(timer.player_timers).updatedAt)}}</p>
                      </div>

                      <div class="level-right">
                        <p class="is-size-7"><i18n path="timers.created-by"/> <span class="name"> {{isCurrentUserTimerCreator(timer.creator.id) ? $t('timers.creator.you') : timer.creator.name}}</span></p>
                      </div>
                    </nav>

                    <div class="content players-list">
                      <b-taglist>
                        <b-tag
                          rounded
                          type="is-info"
                          size="is-small"
                          v-for="player in timer.player_timers"
                          v-bind:key="player.id">{{getPlayerName(player)}}</b-tag>
                      </b-taglist>
                    </div>

                    <nav class="level is-mobile footer-level">
                      <div class="level-left">
                        <router-link
                          :to="{name: 'edittimer', params: {id: timer.id}}"
                          class="level-item">
                          <span class="icon is-small has-text-info">
                            <i class="far fa-edit"></i>
                          </span>
                        </router-link>
                        <a class="level-item" @click="triggerConfirmDeleteModal(timer.id)">
                          <span class="icon is-small has-text-danger">
                            <i class="far fa-trash-alt"></i>
                          </span>
                        </a>
                      </div>
                    </nav>
                  </div>

                  <div class="media-right is-vertical-center is-media-right arrow-right">
                    <span>
                      <i class="fas fa-chevron-right"></i>
                    </span>
                  </div>
                </article>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <confirm-delete-modal
        :active="isConfirmDeleteModalActive"
        :onDelete="deleteTimer"
        :onCancel="onCancelConfirmDeleteModal"
        :content="$t('event.games.confirm-game-deletion')"
      />
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';

import Timer, { TimerTypes } from '@/utils/api/Timer';

// import * as helper from '@/utils/helper';

import moment from 'moment';
import { iso8601ToMoment } from '@/utils/helper';

export default {
  name: 'TimersPage',

  components: {
    HeroTitlePageLayout,
    ConfirmDeleteModal
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
      timers: null,
      isConfirmDeleteModalActive: false,
      timerIdToDelete: null,
    };
  },
  computed: {
    timerTypeI18nPathMap() {
      return {
        [TimerTypes.COUNT_UP]: 'timer.type.count_up',
        [TimerTypes.COUNT_DOWN]: 'timer.type.count_down',
        [TimerTypes.RELOAD]: 'timer.type.reload'
      };
    }
  },
  sockets: {
    timer_delete(id_timer) {
      this.timers = this.timers.filter(t => t.id !== id_timer);
    },
    error(err) {
      this.$notification.open({
        message: err.message,
        type: 'is-error'
      });
    }
  },
  async created() {
    this.timers = await Timer.getCurrentUserTimers();
  },
  methods: {
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
    },

    triggerConfirmDeleteModal(timerId) {
      console.log('trigger');
      this.isConfirmDeleteModalActive = true;
      this.timerIdToDelete = timerId;
    },

    onCancelConfirmDeleteModal() {
      this.isConfirmDeleteModalActive = false;
      this.timerIdToDelete = null;
    },

    deleteTimer() {
      this.$socket.emit('timer_delete', this.timerIdToDelete);
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

  margin-top: auto;
  margin-bottom: auto;
}

.is-media-right {
  margin-left: 2em;
}

.header-level {
  margin-bottom: 0.3em;
}

.footer-level {
  margin-top: 0.4em;
  margin-left: 0.1em;
}

.content.players-list {
  border-top: 1px #f2f2f2 solid;
  border-bottom: 1px #f2f2f2 solid;

  padding-bottom: 0.7em;
  padding-top: 0.7em;

  margin-bottom: 0em;
}

.thumbnail {
  text-align: center;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 32px;
}

.thumbnail.thumbnail-empty {
  background-color: hsl(0, 0%, 86%);
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
