<template>
  <div>
    <hero-title-page-layout>
      <h1 class="title">{{$t('wish-list.title')}}</h1>
      <h2 class="subtitle">{{$t('wish-list.subtitle')}}</h2>
    </hero-title-page-layout>
    <div class="container">
      <div class="section">
        <user-wish-list :isCurrentUserProfile="true" />
      </div>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import UserWishList from '@/components/user/UserWishList';

export default {
  components: {
    HeroTitlePageLayout,
    UserWishList
  }
};
</script>
