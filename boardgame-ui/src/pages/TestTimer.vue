<template>
  <div class="section">
    <div class="buttons">
      <button class="button" @click="closeConnection()">Close</button>
      <button class="button" @click="openConnection()">Open</button>
    </div>
    <ul>
      <li v-for="(ping, idx) in pings" :key="idx">{{ping}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pings: []
    };
  },
  sockets: {
    ping(data) {
      this.pings.push(data);
    }
  },
  methods: {
    openConnection() {
      this.$socket.open();
    },
    closeConnection() {
      this.$socket.close();
    }
  }
};
</script>
