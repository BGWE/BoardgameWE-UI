<template>
  <div>
    <HeroTitlePageLayout :title="$t('event.edition.title')"/>
    <div class="container">
      <b-loading :is-full-page="false" :active="!event" />
      <section v-if="event" class="section">
        <form @submit.prevent="createEvent('form-eventCreation')" data-vv-scope="form-eventCreation">
          <b-field horizontal :label="$t('event.edition.name')"
                  :type="{'is-danger': errors.has('form-eventCreation.name')}"
                  :message="errors.first('form-eventCreation.name')">
            <b-input v-model.trim="event.name" name="name" v-validate="'required'"></b-input>
          </b-field>

          <b-field horizontal :label="$t('event.edition.visibility')">
            <b-select v-model="event.visibility">
              <option v-for="{visibility, i18nPath} in eventVisibilityI18nPath" v-bind:key="i18nPath" :value="visibility">
                <i18n :path="i18nPath"/>
              </option>
            </b-select>
          </b-field>

          <b-field horizontal :label="$t('event.edition.location')"
                  :type="{'is-danger': errors.has('form-eventCreation.location')}"
                  :message="errors.first('form-eventCreation.location')">
            <b-input v-model.trim="event.location" name="location" v-validate="'required'"></b-input>
          </b-field>

          <b-field horizontal :label="$t('event.edition.description')">
            <b-input v-model.trim="event.description" name="description" maxlength="200" type="textarea"></b-input>
          </b-field>

          <b-field horizontal
                  :label="$t('event.edition.startDateTime')"
                  :type="{'is-danger': errors.has('form-eventCreation.startDate')}"
                  :message="errors.first('form-eventCreation.startDate')">
            <DateTimePicker v-model="startDate" name="startDate" v-validate="'required'" ref="startDate"></DateTimePicker>
          </b-field>
          <b-field horizontal
                  :label="$t('event.edition.endDateTime')"
                  :type="{'is-danger': errors.has('form-eventCreation.endDate')}"
                  :message="errors.first('form-eventCreation.endDate')">
            <DateTimePicker v-model="endDate" name="endDate" v-validate="'required|after:startDate'"></DateTimePicker>
          </b-field>

          <b-field horizontal>
            <b-checkbox v-model="event.hide_rankings">
              {{$t('event.edition.hideRankings')}}
            </b-checkbox>
          </b-field>

          <b-field horizontal>
            <b-checkbox v-model="event.attendees_can_edit">
              {{$t('event.edition.attendeesCanEdit')}}
            </b-checkbox>
          </b-field>
          <b-field horizontal>
            <b-checkbox v-model="event.invite_required" >
              {{$t('event.edition.inviteRequired')}}
            </b-checkbox>
          </b-field>
          <b-field horizontal>
            <b-checkbox v-model="event.user_can_join" :disabled="event.invite_required || event.visibility === eventVisibility.SECRET">
              {{$t('event.edition.userCanJoin')}}
            </b-checkbox>
          </b-field>

          <b-field horizontal>
            <button type="submit" class="button is-primary">{{$t('event.edition.submit')}}</button>
          </b-field>

        </form>
      </section>
    </div>
  </div>
</template>

<script>
import Event, { EventVisibility } from '@/utils/api/Event.js';
import * as helper from '@/utils/helper';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import DateTimePicker from '@/components/layout/DateTimePicker';

export default {
  name: 'EventEditionPage',

  components: {
    HeroTitlePageLayout,
    DateTimePicker
  },

  data() {
    return {
      event: null,
      editing: false,
      startDate: null,
      endDate: null
    };
  },

  computed: {
    eventVisibility() {
      return EventVisibility;
    },

    eventVisibilityI18nPath() {
      return [
        {visibility: EventVisibility.SECRET, i18nPath: 'event.visibility.secret'},
        {visibility: EventVisibility.PRIVATE, i18nPath: 'event.visibility.private'},
        {visibility: EventVisibility.PUBLIC, i18nPath: 'event.visibility.public'}
      ];
    }
  },

  watch: {
    'event.visibility': function(value, oldValue) {
      if (value !== oldValue && value === EventVisibility.SECRET) {
        this.event.invite_required = true;
        this.event.user_can_join = false;
      }
    }
  },

  methods: {
    formatDateAsISO8601String : (datetime) => helper.dateToISO8601(datetime),

    formatISO8601StringAsDate : (iso8601) => helper.ISO8601ToDate(iso8601),

    async createEvent(scope) {
      let result = await this.validate(scope);

      if (!result) {
        return;
      }

      try {
        this.event.start = this.formatDateAsISO8601String(this.startDate);
        this.event.end = this.formatDateAsISO8601String(this.endDate);
        await this.event.save();
        this.$router.push({name: 'events'});
      }
      catch (e) {
        console.log(e);
      }
    },

    async validate(scope) {
      let result = await this.$validator.validateAll(scope);

      if (!result) {
        this.$toast.open({
          message: 'Form is not valid! Please check the fields.',
          type: 'is-danger',
          position: 'is-bottom'
        });
      }

      return result;
    }
  },

  async created() {
    if (this.$route.params.eventid) {
      this.editing = true;
      this.event = await Event.fetch(this.$route.params.eventid);
      this.startDate = this.formatISO8601StringAsDate(this.event.start);
      this.endDate = this.formatISO8601StringAsDate(this.event.end);
    }
    else {
      this.event = new Event();
      this.event.description = '';
      this.event.hide_rankings = false;
    }
  },
};
</script>

<style scoped>
.container {
  min-height: 10em;
}
</style>
