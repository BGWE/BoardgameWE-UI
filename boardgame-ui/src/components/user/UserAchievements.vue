<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    
    <div v-for="achievement in this.userAchievements" :key="achievement.id">
      <div class="achievement-container">
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img src="@/assets/achievements/placeholder.png">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong> {{$t(achievement.id_achievement + '.title')}} </strong> <small> @{{formatedDateTime(achievement.createdAt)}} </small>
                <br>
                {{$t(achievement.id_achievement + '.descr')}}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="this.total > this.userAchievements.length" style="padding-top:15px">
      <div class="achievement-container">
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img src="@/assets/achievements/locked_achievement.png">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong> {{$t('achievements.locked')}} </strong>
                <br>
                {{$t('achievements.continue')}}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>

  </div>
</template>

<script>
import User from '@/utils/api/User';
import * as Helper from '@/utils/helper';

export default {
  props: {
    user: User, // if null, achievements of current user
    isCurrentUserProfile: Boolean
  },

  components: {
  },
  
  data() {
    return {
      loading: true,
      userAchievements: null,
      total: null
    };
  },

  methods: {
    formatedDateTime: (datetime) => Helper.formatDatetime(datetime),
  },
  
  async created() {
    this.userAchievements = await User.fetchAchievements();
    this.total = await User.fetchTotalNumberAchievements();
    this.loading = false;
  }
};
</script>

<style scoped>
.achievement-title {
  color: #27475B;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.25;
}
</style>