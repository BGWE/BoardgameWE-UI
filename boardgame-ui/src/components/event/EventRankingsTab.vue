<template>
    <div class="tabwrapper">
      <div class="columns">

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-won')}}</p>
            <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_VICTORY_COUNT])"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-won-percentage')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_VICTORY_PROP], true)"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-played')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_COUNT_GAMES])"></RankingTable>
          </article>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.different-games')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_COUNT_UNIQUE_GAMES])"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-lost')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_DEFEAT_COUNT])"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-lost-percentage')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_DEFEAT_PROP], true)"></RankingTable>
          </article>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-last')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_IS_LAST])"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-last-percentage')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_IS_LAST_PROP], true)"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.gcb')}}</p>
              <RankingTable 
              :type="rankingTableType"
              rankingMethod='POINTS_HIGHER_BETTER'
              :data="formattedRanking(rankings[EVENT_RANKING_GCBGBG])"></RankingTable>
          </article>
        </div>
      </div>
    </div>
</template>

<script>
import RankingTable from '@/components/layout/RankingTable';
import Event from '@/utils/api/Event';

export default {
  components: {
    RankingTable
  },

  data() {
    return {
      rankings: [],
    }
  },

  computed: {
    rankingTableType: () => {
      return 'POINTS_HIGHER_BETTER';
    },

    EVENT_RANKING_COUNT_GAMES: () => 'count_games',
    EVENT_RANKING_COUNT_UNIQUE_GAMES: () => 'count_unique_games',
    EVENT_RANKING_DEFEAT_COUNT: () => 'defeat_count',
    EVENT_RANKING_DEFEAT_PROP: () => 'defeat_prop',
    EVENT_RANKING_GCBGBG: () => 'gcbgb',
    EVENT_RANKING_IS_LAST: () => 'is_last',
    EVENT_RANKING_IS_LAST_PROP: () => 'is_last_prop',
    EVENT_RANKING_VICTORY_COUNT: () => 'victory_count',
    EVENT_RANKING_VICTORY_PROP: () => 'victory_prop',
  },

  methods: {
    getNameFromRankingRow: (row) => {
      let player = row.player;
      if (player.name != null) {
        return player.name;
      }

      return `${player.user.name} ${player.user.surname}`;
    },

    formattedRanking: function(ranking, isPercentage) {
      if (!ranking) {
        return [];
      }
      
      return ranking.map((row => {
        let score = row.score;

        if (isPercentage) {
          score = `${Math.round(row.score * 100)} %`;
        }
        return {
          position: row.rank,
          player: this.getNameFromRankingRow(row),
          score: score
        };
      }));
    }, 
  },

  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);
    if (!this.event.hide_rankings) {
      this.rankings = await this.event.fetchRankings();
      console.log('received');
    }
  },

};
</script>

<style scoped>
</style>
