<template>
    <div>
      <div class="columns">

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-won')}}</p>
            <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_VICTORY_COUNT])"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-won-percentage')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_VICTORY_PROP], true)"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-played')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_COUNT_GAMES])"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.different-games')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_COUNT_UNIQUE_GAMES])"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-lost')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_DEFEAT_COUNT])"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-lost-percentage')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_DEFEAT_PROP], true)"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-last')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_IS_LAST])"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.games-last-percentage')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_IS_LAST_PROP], true)"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>

        <div class="column">
          <article class="tile is-child box">
            <p class="title">{{$t('event.rankings.gcb')}}</p>
              <RankingTable 
              :type="rankingTableType"
              :columns="columns"
              :data="formattedRanking(rankings[EVENT_RANKING_GCBGBG])"
              :onRowClass="onRowClass"
              :perPage="perPage"></RankingTable>
          </article>
        </div>
      </div>
    </div>

</template>

<script>
import RankingTable from '@/components/layout/RankingTable';
import * as Constants from '@/utils/constants';



export default {
  components: {
    RankingTable
  },

  props: {
    rankings: {
      required: true
    }
  },

  computed: {
    rankingTableType: () => {
      return Constants.RANKING_TABLE_TYPE_RANKED;
    },

    columns() {
      console.log(this);
      return [
        {
          field: 'position',
          label: this.$t('event.rankings.table.position'),
          formatter: (value) => {
            if (value > 3) {
              return `<span class="tag">${value}</span>`;
            }

            let winnerClass = null;
            if (value == 1) {
              winnerClass = 'has-background-gold';
            }
            else if (value == 2) {
              winnerClass = 'has-background-silver';
            }
            else if (value == 3) {
              winnerClass = 'has-background-bronze';
            }

            return `<span class="tag ${winnerClass} has-text-white">${value}</span>`;
          }
        },
        {
          field: 'player',
          label: this.$t('event.rankings.table.player')
        },
        {
          field: 'score',
          label: this.$t('event.rankings.table.score')
        },
      ];
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

    perPage: () => 5
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

    onRowClass: (row) => {
      if (row.position === 1 || row.position === 2 || row.position === 3) {
        return 'has-text-weight-semibold has-background-light';
      }
    }
  }
};
</script>

<style scoped>

</style>
