<template>
  <div>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
    <fab
    :position="position"
    :bg-color="bgcolor"
    :actions="actions"
    @create_timer="create_timer"
    @add_game="add_game"
    ></fab>
  </div>
  
</template>

<script>
import fab from 'vue-fab';

export default {
  components: {
    fab
  },
  data() {
    return {
      position: 'bottom-right',
    };
  },
  props: {
    actions: {
      default: () => [
        {
          name: 'add_game',
          icon: 'playlist_add'
        },
        {
          name: 'create_timer',
          icon: 'add_alarm'
        }
      ]
    },
    bgcolor: {
      default: '#E66E50'
    }
  },
  methods: {
    add_game() {
      this.$router.push({name: 'add-game'});
    },
    create_timer() {
      this.$router.push({name: 'create-timer'});
    }
  }
};
</script>
