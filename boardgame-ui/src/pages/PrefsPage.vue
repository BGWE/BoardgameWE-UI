<template>
  <div>
    <HeroTitlePageLayout :title="$t('preferences.title')"/>
    <div class="container">
      <section v-if="currentUser" class="section">
        <h2 class="title">{{$t('preferences.sections.account')}}</h2>

        <form @submit.prevent="updatePersonalInfo('form-personal')" class="settings" data-vv-scope="form-personal">
          <b-field :label="$t('label.username')"
                  :type="{'is-danger': errors.has('form-personal.username')}"
                  :message="errors.first('form-personal.username')">
            <b-input v-model="user.username" name="username" v-validate="'required'"></b-input>
          </b-field>

          <b-field :label="$t('label.email')"
                  :type="{'is-danger': errors.has('form-personal.email-address')}"
                  :message="errors.first('form-personal.email-address')">
            <b-input v-model="user.email" name="email-address" v-validate="'required|email'"></b-input>
          </b-field>

          <b-field :label="$t('label.name')"
                  :type="{'is-danger': errors.has('form-personal.name')}"
                  :message="errors.first('form-personal.name')">
            <b-input v-model="user.name" name="name" v-validate="'required|alpha'"></b-input>
          </b-field>

          <b-field :label="$t('label.surname')"
                  :type="{'is-danger': errors.has('form-personal.surname')}"
                  :message="errors.first('form-personal.surname')">
            <b-input v-model="user.surname" name="surname" v-validate="'required|alpha'"></b-input>
          </b-field>
          <button type="submit" class="button is-primary">
            {{$t('label.updateProfile')}}
          </button>
        </form>

        <h2 class="title">{{$t('preferences.sections.password')}}</h2>
        <form @submit.prevent="updatePassword('form-password')" class="settings" data-vv-scope="form-password">
          <b-field :label="$t('label.password')"
                  :type="{'is-danger': errors.has('form-password.password')}"
                  :message="errors.first('form-password.password')">
            <b-input type="password" v-model="password" name="password" v-validate="'required'"></b-input>
          </b-field>

          <b-field :label="$t('label.newPassword')"
                  :type="{'is-danger': errors.has('form-password.new-password')}"
                  :message="errors.first('form-password.new-password')">
            <b-input type="password" password-reveal v-model="newPassword" name="new-password"
                    v-validate="'required|min:8'"
                    ref="new-password">
            </b-input>
          </b-field>

          <b-field :label="$t('label.confirmNewPassword')"
                  :type="{'is-danger': errors.has('form-password.confirm-new-password')}"
                  :message="errors.first('form-password.confirm-new-password')">
            <b-input type="password" password-reveal v-model="confirmPassword" name="confirm-new-password"
                    v-validate="'required_if:new-password|confirmed:new-password'"
                    :disabled="!newPassword">
            </b-input>
          </b-field>
          <p>{{$t('label.passwordHint')}}</p>
          <button type="submit" class="button is-primary">
            {{$t('label.updatePassword')}}
          </button>
        </form>

      </section>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';

export default {
  components: {
    HeroTitlePageLayout
  },

  data() {
    return {
      user: null,
      password: null,
      newPassword: null,
      confirmPassword: null
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    }
  },

  methods: {
    async updatePersonalInfo(scope) {
      let result = await this.validate(scope);

      if (!result) {
        return;
      }

      this.user.password = null;
      this.user.old_password = null;

      try {
        await this.user.save();
        this.$store.commit('setCurrentUser', this.user.clone());
        this.$toast.open({
          message: this.$t('toast.profile.update.success'),
          type: 'is-success',
          position: 'is-bottom'
        });
      }
      catch (e) {
        console.log(e);
      }
    },

    async updatePassword(scope) {
      let result = await this.validate(scope);

      if (!result) {
        return;
      }

      this.user.password = this.newPassword;
      this.user.old_password = this.password;
      try {
        await this.user.save();
        this.$store.commit('setCurrentUser', this.user);
        this.$toast.open({
          message: this.$t('toast.password.update.success'),
          type: 'is-success',
          position: 'is-bottom'
        });
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

  created() {
    this.user = this.currentUser.clone();
  },
};
</script>

<style scoped>
.settings {
  padding-bottom: 20px;
}
</style>
