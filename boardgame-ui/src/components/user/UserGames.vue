<template>
  <games-list :user="user" :canEdit="isCurrentUserProfile">
    <template #addButton v-if="isCurrentUserProfile">
      <router-link tag="button" class="button is-primary" :to="{name: 'add-game'}">
        {{$t("button.add-game")}}
      </router-link>
    </template>
  </games-list>
</template>

<script>
import User from '@/utils/api/User';
import GamesList from '@/components/games/GamesList';

export default {
  props: {
    user: User,
    isCurrentUserProfile: Boolean
  },
  components: {
    GamesList
  }
};
</script>
