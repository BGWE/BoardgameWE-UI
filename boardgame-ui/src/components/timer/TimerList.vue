<template>
  <div>
      <div class="columns is-centered">
        <div class="column">
          <div class="container" v-if="timers.length === 0">
            <p class="empty-list-message"><i18n path="timers.no-timer"/></p>
          </div>
          <router-link
            v-for="timer in orderedTimers"
            v-bind:key="timer.id"
            :to="{name: 'timer', params: {timerid: timer.id}}"
            class="box timer-box">
              <article class="media">
                <div class="media-left">
                  <figure v-if="timer.board_game !== null" class="image is-64x64 is-rounded background" :style="{backgroundImage: `url('${timer.board_game.thumbnail}')`}"></figure>
                  <figure v-else class="image is-64x64">
                    <img class="is-rounded" :src="require('@/assets/stopwatch-icon.svg')" />
                  </figure>
                </div>

                <div class="media-content">

                  <nav class="level is-mobile-small-device header-level">
                    <div class="level-left">
                      <p class="is-size-7"><i18n v-bind:path="timerTypeI18nPathMap[timer.timer_type]"/> | {{timer.id}}</p>
                    </div>
                    
                    <div class="level-left">
                      <!-- To be re-worked in 3.1, edit is not possible right now
                      <router-link
                        :to="{name: 'edit-timer', params: {id: timer.id}}"
                        class="level-item">
                        <span class="icon is-small has-text-info">
                          <i class="far fa-edit"></i>
                        </span>
                      </router-link>
                      -->
                      <a class="level-right" @click.prevent.stop="triggerConfirmDeleteModal(timer.id)">
                        <span class="icon is-small has-text-danger">
                          <i class="far fa-trash-alt"></i>
                        </span>
                      </a>
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

                  <nav class="level is-mobile-small-device footer-level">
                    <div class="level-left">
                      <p class="is-size-7">{{capitalizeFirstLetter(elapsedFromNow(mostRecentPlayer(timer.player_timers).updatedAt))}}</p>
                    </div>

                    <div class="level-right">
                        <p class="is-size-7"><i18n path="timers.created-by"/> <span class="name"> {{isCurrentUserTimerCreator(timer.creator.id) ? $t('timers.creator.you') : timer.creator.name}}</span></p>
                      </div>
                  </nav>
                </div>

                <div class="media-right is-vertical-center is-media-right arrow-right">
                  <span>
                    <i class="fas fa-chevron-right"></i>
                  </span>
                </div>
              </article>
          </router-link>
        </div>
      </div>

      <confirm-delete-modal
        :active="isConfirmDeleteModalActive"
        :onDelete="deleteTimer"
        :onCancel="onCancelConfirmDeleteModal"
        :content="$t('timers.confirm-timer-deletion')"
      />
  </div>
</template>

<script>
import ConfirmDeleteModal from '@/components/layout/ConfirmDeleteModal';
import { TimerTypes } from '@/utils/api/Timer';
import moment from 'moment';

/**
 * Emits: delete:timer
 */
export default {
  components: {
    ConfirmDeleteModal
  },
  props: {
    timers: {
      type: Array
    }
  },
  data() {
    return {
      columns: [
        { field: 'id', label: 'ID', numeric: true },
        { field: 'board_game', label: 'Board game', center: true },
        { field: 'creator', label: 'Creator', center: true },
        { field: 'createdAt', label: 'Created at' }
      ],
      isConfirmDeleteModalActive: false,
      timerIdToDelete: null,
    };
  },
  computed: {
    orderedTimers() {
      return this.timers.slice(0).sort((a, b) => {
        return moment(this.mostRecentPlayer(b.player_timers).updatedAt).diff(moment(this.mostRecentPlayer(a.player_timers).updatedAt));
      });
    },
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
      this.$emit('delete:timer', id_timer);
      this.isConfirmDeleteModalActive = false;
    },
    error(err) {
      this.$notification.open({
        message: err.message,
        type: 'is-error'
      });
    }
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
      return moment(sinceTime).from(moment());
    },

    triggerConfirmDeleteModal(timerId) {
      this.isConfirmDeleteModalActive = true;
      this.timerIdToDelete = timerId;
    },

    onCancelConfirmDeleteModal() {
      this.isConfirmDeleteModalActive = false;
      this.timerIdToDelete = null;
    },

    deleteTimer() {
      this.$socket.emit('timer_delete', this.timerIdToDelete);
    },

    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
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

  max-width: 500px;
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

.thumbnail.thumbnail-empty {
  background-color: hsl(0, 0%, 86%);
}

.empty-list-message {
  text-align: center;
  opacity: 0.5;
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

  .is-mobile-small-device > .level-right {
    margin-top: 0.1em;
  }
}

@media (min-width: 400px) {
  .is-hidden-small-device {
    margin-bottom: 0px;
  }

  .is-mobile-small-device {
    display: flex;
  }

  .is-mobile-small-device > .level-right {
    margin-top: 0px;
  }
}

</style>
