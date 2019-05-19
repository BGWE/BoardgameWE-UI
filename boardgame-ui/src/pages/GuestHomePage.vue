<template>
    <div>
      <hero-title-page-layout>
        <h1 class="title">
          <i18n path="home.hello"></i18n> !
          <span class="icon"><i class="hero-smile fa fa-smile"></i></span>
        </h1>
        <h2 class="subtitle">
          <i18n path="home.welcome"></i18n>
          <i18n path="app.appName"></i18n>
        </h2>
      </hero-title-page-layout>

      <div class="container">
        <div class="section">
          Lorem ipsum..
        </div>
      </div>
    </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';

export default {
  name: 'GuestHomePage',
  components: {HeroTitlePageLayout}
};
</script>
