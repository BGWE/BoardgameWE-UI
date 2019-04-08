<template>
    <div>
        <PanelList :elements="formatGamesToDisplay()"></PanelList>
    </div>
</template>

<script>
import PanelList from '@/components/layout/PanelList';

import Event from '@/utils/api/Event';
import * as Helper from '@/utils/helper';

export default {
  components: {
    PanelList
  },

  props: ['games'],

  computed: {

  },

  methods: {
    formatGamesToDisplay: function() {

      console.log('games ', this.games);

      let ret = this.games.map(game => {
        return {
          title: game.board_game.name,
          image: game.board_game.thumbnail,
          footer: {
            left: `<time datetime="${game.createdAt}" class="is-size-7">${Helper.formatDatetime(game.createdAt)}</time>`,
          }
        };
      });
      console.log(ret);
      return ret;
    }
  },

  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);
  }
};
</script>

<style scoped>
</style>
