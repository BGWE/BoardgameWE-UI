<template>
  <div class="wrapper">
    <hero-title-page-layout :title="$t('library.title')"></hero-title-page-layout>
    <div class="container">
      <div class="section">
        <user-library :isCurrentUserProfile="true" />
      </div>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import UserLibrary from '@/components/user/UserLibrary';

export default {
  components: {
    HeroTitlePageLayout,
    UserLibrary
  }
};
</script>

<style scoped>
.container {
  min-height: 10em;
}
</style>
