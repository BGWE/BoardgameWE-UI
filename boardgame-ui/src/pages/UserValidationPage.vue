<template>
  <div>
    <HeroTitlePageLayout :title="$t('uservalidation.title')"/>
    <div class="container">
      <b-loading :is-full-page="false" :active="isLoading" />
      <section v-if="users" class="section">
        <b-table :data="users" striped>
          <template slot-scope="props">
            <b-table-column field="id" :label="$t('uservalidation.table.id')" width="40" numeric>
              {{ props.row.id }}
            </b-table-column>

            <b-table-column field="username" :label="$t('uservalidation.table.username')">
              {{ props.row.username }}
            </b-table-column>

            <b-table-column field="email" :label="$t('uservalidation.table.email')">
              {{ props.row.email }}
            </b-table-column>

            <b-table-column field="validated" :label="$t('uservalidation.table.validated')">
              <span v-if="props.row.validated" class="tag is-success">
                {{ $t('global.yes') }}
              </span>
              <button v-else @click="validateUser(props.row.id)" class="button">
                {{ $t('uservalidation.validate') }}
              </button>
            </b-table-column>
          </template>
        </b-table>
      </section>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import User from '@/utils/api/User.js';

export default {
  components: {
    HeroTitlePageLayout
  },

  data() {
    return {
      isLoading: true,
      users: null,
    };
  },

  methods: {
    async validateUser(userId) {
      let data = User.setUserValidation(userId, true);
      console.log(data);
      this.users = await User.fetchUsers();
    }
  },

  async created() {
    this.users = await User.fetchUsers();
    this.isLoading = false;
  },
};
</script>

<style scoped>

</style>
