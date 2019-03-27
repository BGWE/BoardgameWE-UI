<template>
  <div>
    <HeroTitlePageLayout :title="$t('preferences.title')"/>
    <b-loading v-if="isLoading"></b-loading>
    <section v-if="currentUser" class="section">
      <form @submit.prevent="validateBeforeSubmit">

        <b-field :label="$t('label.username')"
                 :type="{'is-danger': errors.has('username')}"
                 :message="errors.first('username')">
          <b-input v-model="user.username" name="username" v-validate="'required'"/>
        </b-field>

        <b-field :label="$t('label.email')"
                 :type="{'is-danger': errors.has('email-address')}"
                 :message="errors.first('email-address')">
          <b-input v-model="user.email" name="email-address" v-validate="'required|email'"/>
        </b-field>

        <b-field :label="$t('label.name')"
                 :type="{'is-danger': errors.has('name')}"
                 :message="errors.first('name')">
          <b-input v-model="user.name" name="name" v-validate="'alpha'"/>
        </b-field>

        <b-field :label="$t('label.surname')"
                 :type="{'is-danger': errors.has('surname')}"
                 :message="errors.first('surname')">
          <b-input v-model="user.surname" name="surname" v-validate="'alpha'"/>
        </b-field>

        <b-field :label="$t('label.password')"
                 :type="{'is-danger': errors.has('password')}"
                 :message="errors.first('password')">
          <b-input type="password" v-model="password" name="password" v-validate="'required|min:8'"/>
        </b-field>

        <b-field :label="$t('label.newpassword')"
                 :type="{'is-danger': errors.has('new-password')}"
                 :message="errors.first('new-password')">
          <b-input type="password" password-reveal v-model="newPassword" name="new-password"
                   v-validate="'required|min:8'"
                   ref="new-password"/>
        </b-field>

        <b-field :label="$t('label.confirmNewPassword')"
                 :type="{'is-danger': errors.has('confirm-new-password')}"
                 :message="errors.first('confirm-new-password')">
          <b-input type="password" password-reveal v-model="confirmPassword"
                   name="confirm-new-password"
                   v-validate="'required_if:new-password|confirmed:new-password'"
                   :disabled="!newPassword"
                   password-reveal/>
        </b-field>

        <button type="submit" class="button is-primary"> {{$t('preferences.submit')}} </button>
      </form>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import VeeValidate from 'vee-validate'
import BLoading from "buefy/src/components/loading/Loading";

Vue.use(VeeValidate, {
  events: ''
})

export default {
  components: {
    BLoading,
    HeroTitlePageLayout
  },

  data() {
    return {
      isLoading: true,
      user: '',
      password: null,
      newPassword: null,
      confirmPassword: null
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },

  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$toast.open({
            message: 'Form is valid!',
            type: 'is-success',
            position: 'is-bottom'
          })
          return;
        }
        this.$toast.open({
          message: 'Form is not valid! Please check the fields.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      });
    }
  },

  async created() {
    this.user = this.currentUser.clone();
    this.isLoading = false;
  },
}
</script>
