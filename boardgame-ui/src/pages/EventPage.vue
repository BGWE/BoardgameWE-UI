<template>
  <div v-if="event">
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{event.name}}
            </h1>
          <h2 class="subtitle">
            {{event.location}} -
            from <bgc-datetime class="hero-datetime" :asdate="true" :datetime="event.start" />
            to <bgc-datetime class="hero-datetime" :asdate="true" :datetime="event.end" />
          </h2>

        </div>
      </div>
    </section>

    <nav class="level is-mobile" id="event-level">
        <div class="level-item has-text-centered">
            <div>
            <p class="heading">{{$t('event.level.games-played')}}</p>
            <p class="title">{{games ? games.length : 0}}</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
            <p class="heading">{{$t('event.level.board-games')}}</p>
            <p class="title">{{event.provided_board_games ? event.provided_board_games.length : 0}}</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
            <p class="heading">{{$t('event.level.attendees')}}</p>
            <p class="title">{{event.attendees ? event.attendees.length : 0}}</p>
            </div>
        </div>
    </nav>

    <div class="tabs is-boxed is-medium">
      <ul>
        <router-link :to="{name: 'event_dashboard'}" tag="li">
          <a class="navbar-item">{{$t('event.tab.dashboard')}}</a>
        </router-link>

        <router-link :to="{name: 'event_board_games'}" tag="li">
          <a class="navbar-item">{{$t('event.tab.boardgames')}}</a>
        </router-link>

        <router-link :to="{name: 'event_games'}" tag="li">
          <a class="navbar-item">{{$t('event.tab.games')}}</a>
        </router-link>

        <router-link v-if="!event.hide_rankings" :to="{name: 'event_rankings'}" tag="li">
          <a class="navbar-item">{{$t('event.tab.rankings')}}</a>
        </router-link>

        <router-link :to="{name: 'event_matchmaking'}" tag="li">
          <a class="navbar-item">{{$t('event.tab.matchmaking')}}</a>
        </router-link>
      </ul>
    </div>

    <router-view :event="event" :isAttendee="isAttendee"></router-view>

  </div>
</template>

<script>
import Event from '@/utils/api/Event';
import BgcDatetime from '@/components/layout/BgcDatetime';

export default {
  components: {
    BgcDatetime,
  },

  data() {
    return {
      event: null,
      games: [],
      rankings: {}
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
    isAttendee() { // is current user attendee
      if(!this.event) {
        return false;
      }
      return this.event.attendees.some(attendee => attendee.id_user === this.currentUser.id);
    }
  },

  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);

    // TODO Should we load those there?
    this.games = await this.event.fetchGames();
  }
};
</script>

<style scoped>
#event-level {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.tabwrapper {
  position: relative;
  min-height: 10em;
  width: 90%;
  margin: auto;
}

.hero-datetime {
  font-style: italic;
}
</style>
