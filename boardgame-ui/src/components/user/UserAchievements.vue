<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <h3>{{$t("achievements.achievements")}}</h3>
      <div v-for="achievement in this.achievements" :key="achievement.id_achievement">
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
                  <strong> {{achievement.title}} </strong> <small> @{{formatedDateTime(achievement.createdAt)}} </small>
                  <br>
                  {{achievement.description}}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <h3>{{$t("achievements.badges")}}</h3>
      <div v-for="(badge_steps, badge_code) in this.badges" :key="badge_code">
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
                  <strong> {{badge_steps[badge_steps.length - 1].title}} </strong> <small> @{{formatedDateTime(badge_steps[badge_steps.length - 1].createdAt)}} </small>
                  <br>
                  {{badge_steps[badge_steps.length - 1].description}}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-if="go_on" style="padding-top:15px">
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

    </template>
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
  
  data() {
    return {
      loading: true,
      achievements: null,
      badges: null,
      go_on: true
    };
  },

  methods: {
    formatedDateTime: (datetime) => Helper.formatDatetime(datetime),
  },
  
  async created() {
    let all = await User.fetchUserAchievements(this.user.id);
    this.achievements = all.achievements;
    this.badges = all.badges;
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