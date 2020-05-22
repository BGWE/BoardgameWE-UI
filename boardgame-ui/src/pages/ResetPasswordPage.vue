<template>
  <div>
    <section v-if="token && userId" class="section">
      <div class="box">
        <h1 class="title">{{$t('auth.reset-password.title')}}</h1>
        <p v-if="error" class="error">{{$t('error.invalid-credentials')}}</p>

        <ValidationObserver v-slot="{ handleSubmit }" >
          <form @submit.prevent="handleSubmit(submitPasswordReset)">

            <InputWithValidation
              password-reveal
              rules="required|min:8"
              type="password"
              :label="$t('label.password')"
              v-model="password"
            />

            <InputWithValidation
              rules="required|confirmed:@password"
              type="password"
              :label="$t('label.confirmPassword')"
              v-model="confirmPassword"
              :disabled="!password"
            />

            <p>{{$t('label.passwordHint')}}</p>

            <p class="control">
              <button class="button is-primary is-fullwidth">
                {{$t('label.submit')}}
              </button>
            </p>
          </form>
        </ValidationObserver>

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
import { ValidationObserver } from 'vee-validate';
import InputWithValidation from '@/components/form/InputWithValidation';

export default {
  components: {
    ValidationObserver,
    InputWithValidation
  },

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
    async submitPasswordReset() {
      try {
        await User.resetPassword(this.token, this.userId, this.password);
        this.$buefy.toast.open({
          message: this.$t('auth.reset-password.success'),
          type: 'is-success',
          position: 'is-bottom'
        });

        this.$router.push({name: 'login'});
      }
      catch (e) {
        console.log(e);

        this.$buefy.toast.open({
          message: this.$t('auth.reset-password.failure'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }
    }
  }
};
</script>
