<template>
  <div>
    <h1 class="title">{{$t('events.title')}}</h1>
    <div class="columns is-multiline">
      <div class="column is-one-quarter" v-for="event in events" :key="event.id">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              {{event.name}}
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              {{event.description}} <br>
              {{event.location}}
            </div>
          </div>
          <footer class="card-footer">
            <div class="buttons">
              <router-link :to="{name: 'event', params:{eventid: event.id}}" class="button is-primary">
                {{$t('events.view')}}
              </router-link>
              <button class="button">{{$t('events.join')}}</button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Event from '@/utils/api/Event';

export default {
  data() {
    return {
      events: []
    };
  },
  async created() {
    this.events = await Event.fetchAll();
  }
};
</script>

<style>
.column {
  display: flex;
}
.card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.card-content {
  flex-grow: 1;
}
.buttons {
  margin: auto;
  padding: 10px;
}
</style>
