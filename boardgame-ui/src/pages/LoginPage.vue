<template>
  <div class="wrapper">
    <b-loading :is-full-page="false" :active="isLoading"/>
    <section v-if="user" class="section">
      <div class="box">
        <h1 class="title"> {{ $t('login.title') }} </h1>
        <p v-if="error" class="error">{{error}}</p>
        <p v-else-if="hasNext" class="error">{{$t('error.must-be-authenticated')}}</p>

        <form @submit.prevent="login">
          <b-field  :label="$t('label.username')"
                    :type="{'is-danger': errors.has('username')}"
                    :message="errors.first('username')">
            <b-input v-model="user.username" v-validate="'required'" name="username"/>
          </b-field>

          <b-field  password-reveal
                    :label="$t('label.password')"
                    :type="{'is-danger': errors.has('password')}"
                    :message="errors.first('password')">
            <b-input v-model="user.password" password-reveal type="password" v-validate="'required'" name="password"/>
          </b-field>

          <p class="control">
            <button class="button is-primary is-fullwidth">
              {{$t('button.login')}}
            </button>
          </p>
        </form>

        <router-link tag="button" class="button is-light is-fullwidth" :to="{name: 'register'}">
          {{$t('button.toggleRegister')}}
        </router-link>

        <div class="forgot-password-box has-text-link">
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

export default {
  name: 'LoginPage',

  data() {
    return {
      user : null,
      confirmPassword:'',
      forgotPasswordEmail: '',
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
      let result = await this.validate();

      if (!result) {
        this.isLoading = false;
        return;
      }

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

    async validate() {
      let result = await this.$validator.validateAll();

      if (!result) {
        this.$toast.open({
          message: this.$t('global.invalid-form'),
          type: 'is-danger',
          position: 'is-bottom'
        });
      }

      return result;
    }
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

.forgot-password-box {
  margin-top: 1em;
}
</style>
