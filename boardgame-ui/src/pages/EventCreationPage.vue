<template>
  <div>
    <HeroTitlePageLayout :title="$t('event.creation.title')"/>
    <b-loading v-if="isLoading"></b-loading>
    <section v-if="event" class="section">
      <form @submit.prevent="createEvent('form-eventCreation')" data-vv-scope="form-eventCreation">
        <b-field :label="$t('event.creation.name')"
                 :type="{'is-danger': errors.has('form-eventCreation.name')}"
                 :message="errors.first('form-eventCreation.name')">
          <b-input v-model="event.name" name="name" v-validate="'required'"></b-input>
        </b-field>

        <b-field :label="$t('event.creation.location')"
                 :type="{'is-danger': errors.has('form-eventCreation.location')}"
                 :message="errors.first('form-eventCreation.location')">
          <b-input v-model="event.location" name="location" v-validate="'required'"></b-input>
        </b-field>

        <b-field :label="$t('event.creation.description')"
                 :type="{'is-danger': errors.has('form-eventCreation.description')}"
                 :message="errors.first('form-eventCreation.description')">
          <b-input v-model="event.description" name="description" v-validate="'required'" maxlength="200" type="textarea"></b-input>
        </b-field>

        <b-field grouped>
          <b-field expanded
                   :label="$t('event.creation.startDateTime')"
                   :type="{'is-danger': errors.has('form-eventCreation.startDate')}"
                   :message="errors.first('form-eventCreation.startDate')">
            <DateTimePicker v-model="event.start" name="startDate" v-validate="'required'" ref="startDate"></DateTimePicker>
          </b-field>
          <b-field expanded
                   :label="$t('event.creation.endDateTime')"
                   :type="{'is-danger': errors.has('form-eventCreation.endDate')}"
                   :message="errors.first('form-eventCreation.endDate')">
            <DateTimePicker v-model="event.end" name="endDate" v-validate="'required|after:startDate'"></DateTimePicker>
          </b-field>
        </b-field>

        <b-field>
          <b-checkbox v-model="event.hide_rankings">
            {{$t('event.creation.hideRankings')}}
          </b-checkbox>
        </b-field>

        <button type="submit" class="button is-primary">
          {{$t('event.creation.submit')}}
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import BLoading from 'buefy/src/components/loading/Loading';
import BCheckbox from 'buefy/src/components/checkbox/Checkbox';
import Event from '@/utils/api/Event.js';
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import DateTimePicker from '@/components/layout/DateTimePicker';

export default {
  name: 'EventCreationPage',

  components: {
    BCheckbox,
    BLoading,
    HeroTitlePageLayout,
    DateTimePicker
  },

  data() {
    return {
      isLoading: true,
      event: null,
    };
  },

  methods: {
    async createEvent(scope) {
      let result = await this.validate(scope);

      if (!result) {
        return;
      }

      try {
        await this.event.save();
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
    this.isLoading = false;
    this.event = new Event();
    this.event.hide_rankings = false;
  },
};
</script>

<style scoped>
</style>
