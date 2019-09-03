<template>
  <div v-if="event">
    <hero-title-page-layout :tabs="tabs">
      <h1 class="title">
        {{event.name}}
        </h1>
      <h2 class="subtitle">
        {{event.location}} -
        <i18n path="event.period-from-to">
          <bgc-datetime place="fromDate" class="hero-datetime" :asdate="true" :datetime="event.start" />
          <bgc-datetime place="toDate" class="hero-datetime" :asdate="true" :datetime="event.end" />
        </i18n>
      </h2>
    </hero-title-page-layout>

    <div class="container">
      <div class="section">
        <router-view :event="event" @update-attendees="fetchAttendees()" />
      </div>
    </div>

    <fab
      position="bottom-right"
      bg-color="#E66E50"
      :actions="fabActions"
      @create_timer="create_timer"
      @add_game="add_game"
    />

  </div>
</template>

<script>
import Event from '@/utils/api/Event';
import BgcDatetime from '@/components/layout/BgcDatetime';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import fab from 'vue-fab';

export default {
  components: {
    HeroTitlePageLayout,
    BgcDatetime,
    fab
  },

  data() {
    return {
      event: null,
      fabActions: [
        {
          name: 'add_game',
          icon: 'playlist_add'
        },
        {
          name: 'create_timer',
          icon: 'add_alarm'
        }
      ]
    };
  },

  computed: {
    tabs() {
      return [
        {name: 'event-dashboard', text: this.$t('event.tab.dashboard')},
        {name: 'event-board-games', text: this.$t('event.tab.boardgames')},
        {name: 'event-games', text: this.$t('event.tab.games')},
        ...(this.event && !this.event.hide_rankings ? [{name: 'event-rankings', text: this.$t('event.tab.rankings')}] : []),
        {name: 'event-matchmaking', text: this.$t('event.tab.matchmaking')},
        {name: 'event-timers', text: this.$t('event.tab.timers')},
        {name: 'event-attendees', text: this.$t('event.tab.attendees')}
      ];
    },
    currentUser() {
      return this.$store.state.currentUser;
    }
  },

  methods: {
    fetchAttendees() {
      this.event.fetchAttendees();
    },
    add_game() {
      this.$router.push({name: 'add-game'});
    },
    create_timer() {
      this.$router.push({name: 'create-timer'});
    }
  },

  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);
  }
};
</script>

<style scoped>
.hero-datetime {
  font-style: italic;
}

.hero {
  margin-bottom: 1rem;
}
</style>
