<template>
  <div class="wrapper">
    <b-loading :is-full-page="false" :active="isLoading"/>
    <section v-if="user" class="section">
      <div class="box">
        <h1 class="title"> {{ $t('login.title') }} </h1>
        <p v-if="error" class="error">{{error}}</p>
        <p v-else-if="hasNext" class="error">{{$t('error.must-be-authenticated')}}</p>

        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(login)">
            <InputWithValidation
              rules="required"
              :label="$t('label.username')"
              v-model="user.username"
            />

            <InputWithValidation
              password-reveal
              rules="required"
              type="password"
              :label="$t('label.password')"
              v-model="user.password"
            />

            <div class="buttons">
              <button class="button is-primary is-fullwidth">
                {{$t('button.login')}}
              </button>
              <router-link class="button is-light is-fullwidth" :to="{name: 'register'}">
                {{$t('button.toggleRegister')}}
              </router-link>
            </div>
          </form>
        </ValidationObserver>

        <div class="has-top-padding has-text-link">
          <router-link :to="{name: 'forgot-password'}">
            {{$t('login.link.forgot-password')}}
          </router-link>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import User from '@/utils/api/User';
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
      error: null,
      isLoading: true
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
    async login() {
      this.isLoading = true;

      try {
        await this.$store.dispatch('login', this.credentials);
        this.isLoading = false;
        this.$router.push(this.next);
      }
      catch(error) {
        console.log(error);
        if(!error.response || !error.response.status) {
          this.error = this.$t('error.unexpected');
        }
        else if(error.response.status === 403) {
          this.error = this.$t('error.account-not-validated');
        }
        else if(error.response.status === 401) {
          this.error = this.$t('error.invalid-credentials');
        }
        else {
          this.error = this.$t('error.unexpected');
        }
        this.isLoading = false;
      }
    },
  },

  created() {
    this.user = new User();
    this.isLoading = false;
  }
};
</script>

<style scoped>
.wrapper {
  position: relative;
}

.box {
  max-width: 500px;
  margin: auto;
}

.error {
  color: red;
  margin-bottom: 0.5em;
}

.has-top-padding {
  margin-top: 1em;
}
</style>
