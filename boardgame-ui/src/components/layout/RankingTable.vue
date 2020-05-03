<template>
  <div>
    <b-table
      :data="data"
      :mobile-cards=false
      :paginated="paginated"
      :per-page="perPage"
      :row-class="onRowClass"
      :loading="loading">

      <template slot-scope="props">
        <b-table-column
          v-for="col in columns(rankingTableTypeFromRankingMethod(rankingMethod))"
          v-bind:key="col.field"
          :field="col.field"
          :label="col.label">

          <div v-if="'formatter' in col" v-html="col.formatter(props.row[col.field], col.field)"></div>
          <div v-else>{{props.row[col.field]}}</div>

        </b-table-column>
      </template>

    </b-table>
  </div>
</template>


<script>

const RANKING_TABLE_TYPE_GROUPED = 'RANKING_TABLE_TYPE_GROUPED';
const RANKING_TABLE_TYPE_RANKED = 'RANKING_TABLE_TYPE_RANKED';
const RANKING_TABLE_TYPE_NO_SCORE = 'RANKING_TABLE_TYPE_NO_SCORE';

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    rankingMethod: {
      type: String,
      required: true
    }
  },

  data() {
    return {
    };
  },

  methods: {
    rankingTableTypeFromRankingMethod(rankingMethod) {
      switch (rankingMethod) {
        case 'WIN_LOSE':
          return RANKING_TABLE_TYPE_GROUPED;
        case 'RANKING_NO_POINT':
          return RANKING_TABLE_TYPE_NO_SCORE;
        default:
          return RANKING_TABLE_TYPE_RANKED;
      }
    },

    columns(rankingType) {
      if (rankingType !== RANKING_TABLE_TYPE_GROUPED) {
        let columns = [
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
          }
        ];

        if(rankingType === RANKING_TABLE_TYPE_RANKED) {
          columns.push({
            field: 'score',
            label: this.$t('event.rankings.table.score')
          });
        }
        return columns;
      }
      else {
        return [
          {
            field: 'score',
            label: this.$t('event.rankings.table.win'),
            formatter: (value) => {
              if (value == 1) {
                return '<div class="tag has-background-gold has-text-white is-26x26"><i class="fas fa-trophy"></i></div>';
              }
              return '';
            }
          },
          {
            field: 'player',
            label: this.$t('event.rankings.table.player')
          },
        ];
      }
    },

    onRowClass(row) {
      if (this.rankingTableTypeFromRankingMethod(this.rankingMethod) !== RANKING_TABLE_TYPE_GROUPED) {
        if (row.position === 1 || row.position === 2 || row.position === 3) {
          return 'has-text-weight-semibold has-background-light';
        }
      }
      else {
        if (row.score === 1) {
          return 'has-text-weight-semibold has-background-light';
        }
      }

    }
  },


  computed: {
    perPage: () => 5,

    loading() {
      if(!this.data) {
        return true;
      }
      return false;
    },

    paginated() {
      if(!this.data) {
        return false;
      }
      return this.data.length > this.perPage;
    }
  },
};
</script>
