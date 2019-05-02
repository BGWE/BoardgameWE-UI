<template>
  <div>
    <section v-if="token && userId" class="section">
      <div class="box">
        <h1 class="title">{{$t('auth.reset-password.title')}}</h1>
        <p v-if="error" class="error">{{$t('error.invalid-credentials')}}</p>

        <form @submit.prevent="validateBeforeSubmit">
          <b-field  password-reveal
                    :label="$t('label.password')"
                    :type="{'is-danger': errors.has('password')}"
                    :message="errors.first('password')">
            <b-input v-model="password"
                    password-reveal type="password"
                    v-validate="{ required: true, min: 8 }"
                    name="password" ref="password"></b-input>
          </b-field>

          <b-field 
                    :label="$t('label.confirmPassword')"
                    :type="{'is-danger': errors.has('confirm-password')}"
                    :message="errors.first('confirm-password')">
            <b-input v-model="confirmPassword"
                    password-reveal type="password"
                    v-validate="'required|confirmed:password'"
                    name="password"
                    :disabled="!password"></b-input>
          </b-field>
          <p>{{$t('label.passwordHint')}}</p>

          <p class="control">
            <button class="button is-primary is-fullwidth">
              {{$t('label.submit')}}
            </button>
          </p>
        </form>

      </div>
    </section>

    <section v-else>
      <b-message type="is-danger" has-icon>
        {{$t('auth.reset-password.no-token-message')}}
      </b-message>
    </section>
    
  </div>
</template>

<script>
import User from '@/utils/api/User';

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      error: false,
    };
  },

  computed: {
    token() {
      if (!('token' in this.$route.query)) {
        return null;
      }
      return this.$route.query.token;
    },

    userId() { 
      if (!('id' in this.$route.query)) {
        return null;
      }
      return parseInt(this.$route.query.id, 10);
    }
  },

  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(async (valid) => {
        if (valid) {
          try {
            await User.resetPassword(this.token, this.userId(), this.password);
            this.$toast.open({
              message: this.$t('auth.reset-password.success'),
              type: 'is-success',
              position: 'is-bottom'
            });

            this.$router.push({name: 'login'});
          }
          catch (e) {
            console.log(e);

            this.$toast.open({
              message: this.$t('auth.reset-password.failure'),
              type: 'is-danger',
              position: 'is-bottom'
            });
          }
        }
      });
    },
  }
};
</script>

<style scoped>

</style>
