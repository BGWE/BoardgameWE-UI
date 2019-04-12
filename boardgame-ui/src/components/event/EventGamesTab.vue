<template>
  <div class="tabwrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <div class="columns" v-if="!loading">
      <div class="column is-full">
        <PanelList>
          <PanelListElement
            v-for="(game, index) in games"
            v-bind:key="index">
            
            <template v-slot:title>
              {{game.board_game.name}}
            </template>

            <template v-slot:img>
              <figure class="image is-64x64 is-rounded" :style="{backgroundImage: `url('${game.board_game.image}')`}"></figure>
            </template>

            <template v-slot:content>
              <div>
                <RankingTable 
                :rankingMethod="game.ranking_method"
                :data="formattedRanking(game)"></RankingTable>
              </div>
            </template>

            <template v-slot:buttons>
              <a class="card-footer-item">
                <span class="icon"><i class="far fa-edit"></i></span>
                Edit
              </a>
              <a class="card-footer-item card-footer-item-danger">
                <span class="icon"><i class="far fa-trash-alt"></i></span>
                Delete
              </a>
            </template>

            <template v-slot:footer>
              <span class="has-text-weight-light has-text-dark is-size-7 time-footer">
                <time :datetime="game.createdAt">{{formatDatetime(game.createdAt)}}</time>
                </span>
            </template>

          </PanelListElement>
        </PanelList>
      </div>
    </div>
  </div>
</template>

<script>
import PanelList from '@/components/layout/PanelList';
import PanelListElement from '@/components/layout/PanelListElement';
import RankingTable from '@/components/layout/RankingTable';

import Event from '@/utils/api/Event';
import * as Helper from '@/utils/helper';

export default {
  components: {
    PanelList,
    PanelListElement,
    RankingTable
  },

  data() {
    return {
      loading: true,
      games: []
    }
  },

  methods: {
    formatDatetime: (datetime) => Helper.formatDatetime(datetime),

    formattedRanking: function(game) {
      let players = game.players;
      let data = [];

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const name = `${player.user.name} ${player.user.surname}`;
        const score = player.score;

        if (game.ranking_method === 'WIN_LOSE') {
          data.push({
            'player': name,
            'score': score,
          });
        } 
        else {
          // score, player
          data.push({
            'position': i+1,
            'player': name,
            'score': score,
          });
        }
      }
      return data;
    }
  },

  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);
    this.games = await this.event.fetchGames();

    this.loading = false;
  },

};
</script>

<style scoped>
.card-footer-item-danger {
  color: hsl(348, 100%, 61%);
}

.time-footer {
  margin-left: 10px;
}
</style>
