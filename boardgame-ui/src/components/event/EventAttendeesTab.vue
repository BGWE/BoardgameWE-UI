<template>
  <div class="tabwrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <div class="columns" v-if="!loading">
      <div class="column is-full">
        <!-- <p v-if="event.current.can_write" class="has-text-right limited-width"> -->
          <!-- Disabled because page not yet implemented -->
          <!-- <router-link disabled :to="{name: 'add-attendees'}" class="button is-primary"> {{$t('event.attendees.invite')}} </router-link> -->
        <!-- </p> -->

        <section v-if="event.attendees" class="section limited-width">
          <b-table :data="event.attendees" striped>
            <template slot-scope="props">
              <b-table-column field="username" :label="$t('label.name')">
                {{ props.row.user.name }}
              </b-table-column>

              <b-table-column field="username" :label="$t('label.surname')">
                {{ props.row.user.surname }}
              </b-table-column>

              <b-table-column field="username" :label="$t('label.username')">
                {{ props.row.user.username }}
              </b-table-column>

              <b-table-column field="createdAt" :label="$t('event.attendees.joined-on')">
                <bgc-datetime :datetime="props.row.createdAt"></bgc-datetime>
              </b-table-column>

              <b-table-column field="createdAt" :label="$t('event.attendees.host')">
                <span class='tag is-success' v-if="event.id_creator == props.row.user.id">
                    <i18n path='global.yes'></i18n>
                </span>
              </b-table-column>

              <b-table-column field="username" :label="$t('label.profile')" centered>
                <router-link :to="{name: 'user-profile', params: {id: props.row.user.id}}">
                  <span class="icon">
                    <i class="far fa-user-circle"></i>
                  </span>
                </router-link>
              </b-table-column>
            </template>
          </b-table>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Event from '@/utils/api/Event';
import BgcDatetime from '@/components/layout/BgcDatetime';

export default {
  components: {BgcDatetime},
  props: {
    event: Event
  },

  data() {
    return {
      loading: false
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  }
};
</script>

<style scoped>
.limited-width {
  max-width: 600px;
  margin: auto;
  margin-bottom: 1em;
}

.user-card {
  border: 1px #f2f2f2 solid;
  margin-bottom: 5px;
}

.card-footer {
  font-size: 0.7em;
}
</style>
