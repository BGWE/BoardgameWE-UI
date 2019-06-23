<template>
  <div v-if="event">
    <hero-title-page-layout :tabs="tabs">
      <h1 class="title">
        {{event.name}}
        </h1>
      <h2 class="subtitle">
        {{event.location}} -
        from <bgc-datetime class="hero-datetime" :asdate="true" :datetime="event.start" />
        to <bgc-datetime class="hero-datetime" :asdate="true" :datetime="event.end" />
      </h2>
    </hero-title-page-layout>

    <div class="container">
      <div class="section">
        <router-view :event="event"/>
      </div>
    </div>
  </div>
</template>

<script>
import Event from '@/utils/api/Event';
import BgcDatetime from '@/components/layout/BgcDatetime';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';

export default {
  components: {
    HeroTitlePageLayout,
    BgcDatetime
  },

  data() {
    return {
      event: null
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
