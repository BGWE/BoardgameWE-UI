<template>
  <div>
    
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{$t('home.hello')}} {{ currentUser.name }} ! 
            <span class="icon">
              <i class="hero-smile fa fa-smile"></i>
            </span>
          </h1>
          <h2 class="subtitle">
            {{$t('home.welcome')}} {{$t('app.appName')}}.
          </h2>
        </div>
      </div>
    </section>

    <section class="section" v-if="ongoingEvent">
        <router-link tag="button" class="button is-large is-fullwidth" :to="{name: 'event', params: {eventid: ongoingEvent.id}}">  
          <p>Ongoing: {{ongoingEvent.name}}</p> <span class="icon"><i class="fa fa-arrow-right"></i></span>
        </router-link>
    </section>

    <section class="section">
      <h2 class="subtitle">{{$t('home.statistics')}}</h2>
    </section>

    <section class="section">
      <h2 class="subtitle">{{$t('home.recentActivities')}}</h2>
      <div class="box">
        <p>Played a lot...</p>
      </div>

      <div class="box">
        <p>Played a lot...</p>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  data() {
    return {
      userStats: null,
      ongoingEvent: {id: 1, name: 'week end'}
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },
  }
};
</script>

<style>
.hero-smile {
    font-size: 25px;
}

.button {
  margin-top: 20px;
}

.section {
  padding-top: 0px;
  padding-bottom: 20px;
}
</style>