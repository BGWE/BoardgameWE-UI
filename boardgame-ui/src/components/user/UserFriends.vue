<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <b-table :data="friends" striped>
        <template #default="{row: user}">
          <b-table-column :label="$t('label.name')">
            {{ user.name }}
          </b-table-column>

          <b-table-column :label="$t('label.surname')">
            {{ user.surname }}
          </b-table-column>

          <b-table-column :label="$t('label.username')">
            {{ user.username }}
          </b-table-column>

          <b-table-column :label="$t('label.profile')" centered>
            <router-link :to="{name: 'user-profile', params: {id: user.id}}">
              <span class="icon">
                <i class="far fa-user-circle"></i>
              </span>
            </router-link>
          </b-table-column>
        </template>
      </b-table>
    </template>
  </div>
</template>

<script>
import User from '@/utils/api/User';

export default {
  props: {
    user: User
  },
  data() {
    return {
      loading: true,
      friends: null
    };
  },
  async created() {
    this.friends = await this.user.fetchFriends();
    this.loading = false;
  }
};
</script>

