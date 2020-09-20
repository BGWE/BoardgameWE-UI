<template>
  <div>
    <section v-if="user" class="section">
      <div class="box">
        <h1 class="title"> {{$t('register.title')}} </h1>
        <p v-if="error" class="error">{{$t('error.invalid-credentials')}}</p>
        <p v-if="hasNext" class="error">{{$t('error.must-be-authenticated')}}</p>

        <validation-observer ref="form">
          <form @submit.prevent="register">
             <InputWithValidation
              rules="required"
              mode="eager"
              :label="$t('label.username')"
              v-model="user.username"
            />

            <InputWithValidation
              rules="required|min:8"
              mode="eager"
              vid="password"
              type="password"
              :label="$t('label.password')"
              v-model="user.password"
            />

            <InputWithValidation
              rules="required|confirmed:password"
              mode="eager"
              type="password"
              password-reveal
              :label="$t('label.confirmPassword')"
              v-model="confirmPassword"
              :disabled="!user.password"
            />

            <p> {{$t('label.passwordHint')}} </p>

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

            <InputWithValidation
              rules="required|email"
              mode="eager"
              :label="$t('label.email')"
              v-model="user.email"
            />

            <div class="buttons">
              <button class="button is-primary is-fullwidth">
                {{ $t('button.register') }}
              </button>
              <router-link class="button is-light is-fullwidth" :to="{name: 'login'}">
                {{ $t('button.toggleLogin') }}
              </router-link>
            </div>
          </form>
        </validation-observer>

      </div>
    </section>
  </div>
</template>

<script>
import User from '../utils/api/User';
import { ValidationObserver } from 'vee-validate';
import InputWithValidation from '@/components/form/InputWithValidation';

export default {
  name: 'LoginPage',

  components: {
    ValidationObserver,
    InputWithValidation
  },

  data() {
    return {
      user : null,
      confirmPassword:'',
      error: false,
      registering: false
    };
  },

  computed: {
    hasNext() {
      return this.$route.query.next != null;
    },
    next() {
      return this.$route.query.next || {name: 'home'};
    },
    credentials() {
      return {username: this.user.username, password: this.user.password};
    }
  },

  methods: {
    async register() {

      let result = await this.$refs.form.validate();

      if (!result) {
        this.$buefy.toast.open({
          message: this.$t('global.invalid-form'),
          type: 'is-danger',
          position: 'is-bottom'
        });
        return;
      }

      try {
        await this.user.save();
        this.$buefy.toast.open({
          message: this.$t('register.toast.success'),
          type: 'is-success',
          position: 'is-bottom'
        });
        this.$router.push({name: 'login'});
      }
      catch (error) {
        console.log(error);
        this.error = true;
      }
    },
  },

  created() {
    this.user = new User();
  }
};
</script>

<style scoped>
  .box {
    max-width: 500px;
    margin: auto;
  }

  .error {
    color: red;
  }
</style>
