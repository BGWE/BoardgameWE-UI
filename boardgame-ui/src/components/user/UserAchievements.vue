<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <div class="columns">
      <div class="column" v-for="achievement in this.userAchievements" :key="achievement.id">
        <div class="columns">
          <div class="column is-narrow">
            <img src="@/assets/achievements/placeholder.png">
          </div>
          <div class="column is-narrow">
            <h2> {{achievement.name}} </h2>
            <p> {{achievement.description}} </p>
            <p> Obtained on {{formatedDateTime(achievement.createdAt)}} </p>
          </div>
        </div>
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
      userAchievements: null
    };
  },

  methods: {
    formatedDateTime: (datetime) => Helper.formatDatetime(datetime),
  },
  
  async created() {
    this.userAchievements = await User.fetchAchievements();
    console.log(this.userAchievements);
    this.loading = false;
  }
};
</script>
