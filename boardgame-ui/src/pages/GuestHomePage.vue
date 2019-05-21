<template>
    <div>
      <hero-title-page-layout>
        <h1 class="title">
          <i18n path="home.hello"/> !
          <span class="icon"><i class="hero-smile fa fa-smile"></i></span>
        </h1>
        <h2 class="subtitle">
          <i18n path="home.welcome"/>
          <i18n path="app.appName"/>
        </h2>
      </hero-title-page-layout>

      <div class="container">
        <section class="content app-description">
          <h2><i18n path="home.description.title"/></h2>
          <p><i18n path="app.appName"/> <i18n path="home.app_description" /></p>
        </section> 

        <section class="section content">
          <div class="columns" v-if="statistics">
            <div class="column has-text-centered">
              <p class="heading"><i18n path="home.stats.active_users" /></p>
              <p class="title">{{statistics.users_count}}</p>
            </div>

            <div class="column has-text-centered">
              <p class="heading"><i18n path="home.stats.owned" /></p>
              <p class="title">{{statistics.board_games_owned_count}}</p>
            </div>

            <div class="column has-text-centered">
              <p class="heading"><i18n path="home.stats.played" /></p>
              <p class="title">{{statistics.games_count}}</p>
            </div>

            <div class="column has-text-centered">
              <p class="heading"><i18n path="home.stats.events_organized" /></p>
              <p class="title">{{statistics.events_count}}</p>
            </div>
          </div>
        </section>

        <section>
          <div class="columns features-list">

             <div class="column card feature-card is-secondary">
              <div class="card-image">
                <figure class="image is-3by2 feature-figure">
                  <img src="@/assets/feature-library.png" alt="library-feature">
                </figure>
              </div>

              <div class="card-content">
                <h3 class="feature-title">
                  <i18n path="home.features.library" />
                </h3>
                <p>
                  <i18n path="home.features.library_description" />
                </p>
              </div>
            </div>

            <div class="column card feature-card is-secondary">
              <div class="card-image">
                <figure class="image is-3by2 feature-figure">
                  <img src="@/assets/feature-event.png" alt="event-feature">
                </figure>
              </div>

              <div class="card-content">
                <h3 class="feature-title">
                  <i18n path="home.features.events" />
                </h3>
                <p>
                  <i18n path="home.features.events_description" />
                </p>
              </div>
            </div>

            <div class="column card feature-card is-secondary">
              <div class="card-image">
                <figure class="image is-3by2 feature-figure">
                  <img src="@/assets/feature-timer.png" alt="timer-feature">
                </figure>
              </div>

              <div class="card-content">
                <h3 class="feature-title">
                  <i18n path="home.features.timer"/>
                </h3>
                <p>
                  <i18n path="home.features.timer_description"/>
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
</template>

<script>
import Application from '@/utils/api/Application';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';

export default {
  name: 'GuestHomePage',
  components: {HeroTitlePageLayout},
  data() {
    return {
      statistics: null
    };
  },
  async created() {
    this.statistics = await Application.statistics();
  }
};
</script>

<style scoped>
.feature-title {
  font-weight: bold;
}

.app-description {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
}

.features-list {
  margin-left: 5px;
  margin-right: 5px;
}

.feature-card {
  margin: 5px;
}

.feature-figure {
  opacity: 1;
  -moz-box-shadow:    0px 0px 8px 5px #eeeeee;
  -webkit-box-shadow: 0px 0px 8px 5px #eeeeee;
  box-shadow:         0px 0px 8px 5px #eeeeee;
}
</style>
