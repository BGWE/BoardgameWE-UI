<template>
    <div class="columns">
      <div class="column is-full">
        <PanelList>
          <PanelListElement
            v-for="(game, index) in games"
            v-bind:key="index">

            <template v-slot:thumbnail>
                <figure class="image is-64x64" :style="{backgroundImage: `url('${game.board_game.image}')`}"></figure>
            </template>
            
            <template v-slot:title>
              {{game.board_game.name}}
            </template>

            <template v-slot:content>
              <RankingTable 
                :rankingMethod="game.ranking_method"
                :data="formattedRanking(game)"></RankingTable>
            </template>

            <template v-slot:footer>
              <h6 class="title is-6"><time :datetime="game.createdAt" class="is-size-7">{{formatDatetime(game.createdAt)}}</time></h6>
              
            </template>

          </PanelListElement>
        </PanelList>
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

  props: ['games'],

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
  }
};
</script>

<style scoped>
</style>
