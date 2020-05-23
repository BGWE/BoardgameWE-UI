<template>
  <div>
    <HeroTitlePageLayout :title="$t('event.edition.title')"/>
    <div class="container">
      <b-loading :is-full-page="false" :active="!event" />
      <section v-if="event" class="section">
        <ValidationObserver ref="form">
          <form @submit.prevent="createEvent">
            <InputWithValidation
              horizontal
              :label="$t('event.edition.name')"
              v-model.trim="event.name"
              rules="required"
            />

            <b-field horizontal :label="$t('event.edition.visibility')">
              <b-select v-model="event.visibility">
                <option v-for="{visibility, i18nPath} in eventVisibilityI18nPath" v-bind:key="i18nPath" :value="visibility">
                  <i18n :path="i18nPath"/>
                </option>
              </b-select>
            </b-field>

            <InputWithValidation
              horizontal
              rules="required"
              :label="$t('event.edition.location')"
              v-model.trim="event.location"
            />

            <b-field horizontal :label="$t('event.edition.description')">
              <b-input
                v-model.trim="event.description"
                maxlength="200"
                type="textarea"
              />
            </b-field>
            
            <DateTimePicker
              horizontal
              rules="required"
              vid="startDate"
              :label="$t('event.edition.startDateTime')"
              v-model="startDate"
            />

            <DateTimePicker
              horizontal
              rules="required|date_after:@startDate"
              :label="$t('event.edition.endDateTime')"
              v-model="endDate"
            />

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
              <b-checkbox 
                v-model="event.user_can_join" 
                :disabled="event.invite_required || event.visibility === eventVisibility.SECRET"
              >
                {{$t('event.edition.userCanJoin')}}
              </b-checkbox>
            </b-field>

            <b-field horizontal>
              <button type="submit" class="button is-primary">{{$t('event.edition.submit')}}</button>
            </b-field>

          </form>
        </ValidationObserver>
      </section>
    </div>
  </div>
</template>

<script>
import Event, { EventVisibility } from '@/utils/api/Event.js';
import * as helper from '@/utils/helper';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import DateTimePicker from '@/components/form/DateTimePicker';
import InputWithValidation from '@/components/form/InputWithValidation';
import { ValidationObserver } from 'vee-validate';

export default {
  name: 'EventEditionPage',

  components: {
    HeroTitlePageLayout,
    DateTimePicker,
    ValidationObserver,
    InputWithValidation
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
    },
    'event.invite_required': function(value, oldValue) {
      if (value !== oldValue && value === true) {
        this.event.user_can_join = false;
      }
    }
  },

  methods: {
    formatDateAsISO8601String : (datetime) => helper.dateToISO8601(datetime),

    formatISO8601StringAsDate : (iso8601) => helper.ISO8601ToDate(iso8601),

    async createEvent() {
      let result = await this.$refs.form.validate();

      if (!result) {
        this.$buefy.toast.open({
          message: 'Form is not valid! Please check the fields.',
          type: 'is-danger',
          position: 'is-bottom'
        });
        return;
      }

      try {
        this.event.start = this.formatDateAsISO8601String(this.startDate);
        this.event.end = this.formatDateAsISO8601String(this.endDate);
        await this.event.save({auto_join: true});
        this.$router.push({name: 'events'});
      }
      catch (e) {
        console.log(e);
      }
    },
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
      this.event.attendees_can_edit = true;
    }
  },
};
</script>

<style scoped>
.container {
  min-height: 10em;
}
</style>
