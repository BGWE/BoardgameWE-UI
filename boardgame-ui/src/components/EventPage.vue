<template>
  <div>

    <section class="hero is-primary">
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

    <nav class="level is-mobile">
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

    <div class="tabs is-medium">
        <ul>
            <li class="is-active"><a>{{$t('event.tab.dashboard')}}</a></li>
            <li><a>{{$t('event.tab.boardgames')}}</a></li>
            <li><a>{{$t('event.tab.games')}}</a></li>
            <li><a>{{$t('event.tab.rankings')}}</a></li>
            <li><a>{{$t('event.tab.matchmaking')}}</a></li>
            
        </ul>
    </div>

  </div>
</template>

<script>
import Event from '@/utils/api/Event';

export default {
  data() {
    return {
      event: {},
      games: [],
    };
  },
  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);
    
    this.games = await this.event.fetchGames(); //TODO Should we load that there?
  }
};
</script>

<style scoped>
</style>
