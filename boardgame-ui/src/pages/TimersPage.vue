<template>
  <b-table :data="data" :columns="columns" selectable @select="timerSelected"></b-table>
</template>

<script>
import Timer from '@/utils/api/Timer';
import * as helper from '@/utils/helper';

export default {
  name: 'TimersPage',
  data() {
    return {
      data: [],
      columns: [
        { field: 'id', label: 'ID', numeric: true },
        { field: 'board_game', label: 'Board game', center: true },
        { field: 'creator', label: 'Creator', center: true  },
        { field: 'createdAt', label: 'Created at' }
      ],
      timers: null
    };
  },
  async created() {
    this.timers = await Timer.getCurrentUserTimers();
    this.data = this.timers.map(t => {
      return {
        id: t.id,
        board_game: t.game ? t.game.board_game.name : null,
        creator: t.creator.user ? t.creator.user.username : t.creator.name,
        createdAt: helper.formatDatetime(t.createdAt)
      };
    });
  },
  methods: {
    timerSelected(timer) {
      this.$router.push({ name: 'timer', params: { timerid: timer.id } });
    }
  }
};
</script>

<style scoped>

</style>
