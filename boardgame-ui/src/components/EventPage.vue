<template>
  <div>
    <section class="hero is-primary is-bold">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    {{event.name}}
                    </h1>
                <h2 class="subtitle">
                    {{event.location}}
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

    <b-tabs v-model="activeTab" type="is-boxed" size="is-medium">
      <b-tab-item :label="$t('event.tab.dashboard')">

      </b-tab-item>

      <b-tab-item :label="$t('event.tab.boardgames')">

      </b-tab-item>

      <b-tab-item :label="$t('event.tab.games')">
        <EventGamesTab v-if="games.length > 0" :games="games"></EventGamesTab>
      </b-tab-item>

      <b-tab-item :label="$t('event.tab.rankings')">
        <EventRankingsTab v-if="games.length > 0" :rankings="rankings"></EventRankingsTab>
      </b-tab-item>

      <b-tab-item :label="$t('event.tab.matchmaking')">

      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import EventGamesTab from '@/components/EventGamesTab';
import EventRankingsTab from '@/components/EventRankingsTab';
import Event from '@/utils/api/Event';

export default {
  data() {
    return {
      activeTab: 0,
      event: {},
      games: [],
      rankings: []
    };
  },
  components: {
    EventGamesTab,
    EventRankingsTab
  },
  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);
    
    //TODO Should we load those there?
    this.games = await this.event.fetchGames(); 
    console.log('games ', this.games);
    this.rankings = await this.event.fetchRankings(); 
  }
};
</script>

<style scoped>
#event-level {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
