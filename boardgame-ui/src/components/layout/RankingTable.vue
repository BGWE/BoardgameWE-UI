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
    rankingTableTypeFromRankingMethod: function(rankingMethod) {
      switch (rankingMethod) {
          case "WIN_LOSE":
              return this.RANKING_TABLE_TYPE_GROUPED;
              break;

          case "POINTS_HIGHER_BETTER":
              return this.RANKING_TABLE_TYPE_RANKED;
              break;

          case "POINTS_LOWER_BETTER":
              return this.RANKING_TABLE_TYPE_RANKED;
              break;        
      
          default:
              return this.RANKING_TABLE_TYPE_RANKED;
              break;
      }
    },

    columns: function(rankingType) {
      if (rankingType === this.RANKING_TABLE_TYPE_RANKED) {
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
      } 
      
      else {
        return [
          {
            field: 'score',
            label: this.$t('event.rankings.table.win'),
            formatter: (value) => {
              if (value == 1) {
                return `<div class="tag has-background-gold has-text-white is-26x26"><i class="fas fa-trophy"></i></div>`;
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

    onRowClass: function(row) {
      if (this.rankingTableTypeFromRankingMethod(this.rankingMethod) === this.RANKING_TABLE_TYPE_RANKED) {
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
    RANKING_TABLE_TYPE_GROUPED() { 
      return 'RANKING_TABLE_TYPE_GROUPED';
    },
    RANKING_TABLE_TYPE_RANKED() { 
      return 'RANKING_TABLE_TYPE_RANKED';
    },
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

<style scoped>
</style>