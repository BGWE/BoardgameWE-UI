<template>
    <div>
      <section class="hero is-dark">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              {{$t('home.hello')}} !
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

      Lorem ipsum..
    </div>
</template>

<script>
export default {
  name: 'GuestHomePage'
};
</script>

<style scoped>

</style>
