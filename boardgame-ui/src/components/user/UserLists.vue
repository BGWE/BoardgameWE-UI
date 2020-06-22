<template>
<div>
<div class="columns is-multiline is-mobile">
  <div class="column is-one-quarter" v-for="list in lists" v-bind:key="list.id">
    <div class="card">
      <div class="card-content">
        {{list.name}}
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
// import BoardGameList from '@/components/board_games/BoardGameList';
import User from '@/utils/api/User';

export default {
  props: {
    
  },
  components: {
    // BoardGameList
  },
  data() {
    return {
      lists: []
    };
  },
  computed: {
  },
  methods: {
    
  },
  async created() {
    this.lists = await User.fetchCurrentUserLists();
  }
};
</script>
