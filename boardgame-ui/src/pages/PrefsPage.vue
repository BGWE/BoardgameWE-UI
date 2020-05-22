<template>
  <div>
    <HeroTitlePageLayout :title="$t('preferences.title')"/>
    <div class="container">
      <section v-if="currentUser" class="section">
        <h2 class="title">{{$t('preferences.sections.account')}}</h2>

        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(updatePersonalInfo)" class="settings">
            <InputWithValidation
              rules="required"
              :label="$t('label.username')"
              v-model="user.username"
            />

            <InputWithValidation
              rules="required|email"
              mode="eager"
              :label="$t('label.email')"
              v-model="user.email"
            />

            <InputWithValidation
              rules="required"
              mode="eager"
              :label="$t('label.name')"
              v-model="user.name"
            />

            <InputWithValidation
              rules="required"
              mode="eager"
              :label="$t('label.surname')"
              v-model="user.surname"
            />

            <button type="submit" class="button is-primary">
              {{$t('label.updateProfile')}}
            </button>
          </form>
        </ValidationObserver>

        <h2 class="title">{{$t('preferences.sections.password')}}</h2>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(updatePassword)" class="settings">
             <InputWithValidation
              rules="required"
              type="password"
              :label="$t('label.password')"
              v-model="password"
            />

            <InputWithValidation
              rules="required|min:8"
              name="Password"
              type="password"
              password-reveal
              :label="$t('label.newPassword')"
              v-model="newPassword"
            />

            <InputWithValidation
              password-reveal
              rules="required|password:@password"
              type="password"
              mode="eager"
              :label="$t('label.confirmNewPassword')"
              v-model="confirmPassword"
              :disabled="!newPassword"
            />

            <p>{{$t('label.passwordHint')}}</p>
            <button type="submit" class="button is-primary">
              {{$t('label.updatePassword')}}
            </button>
          </form>
        </ValidationObserver>

      </section>
    </div>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import { ValidationObserver } from 'vee-validate';
import InputWithValidation from '@/components/form/InputWithValidation';

export default {
  components: {
    HeroTitlePageLayout,
    ValidationObserver,
    InputWithValidation
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
    async updatePersonalInfo() {
      this.user.password = null;
      this.user.old_password = null;

      try {
        await this.user.save();
        this.$store.commit('setCurrentUser', this.user.clone());
        this.$buefy.toast.open({
          message: this.$t('toast.profile.update.success'),
          type: 'is-success',
          position: 'is-bottom'
        });
      }
      catch (e) {
        console.log(e);
      }
    },

    async updatePassword() {
      this.user.password = this.newPassword;
      this.user.old_password = this.password;

      try {
        await this.user.save();
        this.$store.commit('setCurrentUser', this.user);
        this.$buefy.toast.open({
          message: this.$t('toast.password.update.success'),
          type: 'is-success',
          position: 'is-bottom'
        });
      }
      catch (e) {
        console.log(e);
      }
    },
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
