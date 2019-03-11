<template>
    <div>
        <PanelList>
          <PanelListElement
            v-for="(game, index) in games"
            v-bind:key="index">
            
            <template v-slot:title>
              {{game.board_game.name}}
            </template>

            <template v-slot:content>
              
            </template>

            <template v-slot:footer>
              <time :datetime="game.createdAt" class="is-size-7">{{formatDatetime(game.createdAt)}}</time>
            </template>

          </PanelListElement>
        </PanelList>
    </div>
</template>

<script>
import PanelList from '@/components/layout/PanelList';
import PanelListElement from '@/components/layout/PanelListElement';

import Event from '@/utils/api/Event';
import * as Helper from '@/utils/helper';

export default {
  components: {
    PanelList,
    PanelListElement
  },

  props: ['games'],


  methods: {
    formatDatetime: (datetime) => Helper.formatDatetime(datetime)
  },

  async created() {
    this.event = await Event.fetch(this.$route.params.eventid);    
  }
};
</script>

<style scoped>
</style>
