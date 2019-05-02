<template>
  <div>
    <b-loading :active="isLoading"/>
    <section v-if="user" class="section">
      <div class="box">
        <h1 class="title"> {{ $t('login.title') }} </h1>
        <p v-if="error" class="error">{{$t('error.invalid-credentials')}}</p>
        <p v-if="hasNext" class="error">{{$t('error.must-be-authenticated')}}</p>

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
            <b-input v-model="user.password" password-reveal type="password" v-validate="required" name="password"/>
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
      error: false,
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
        this.error = true;
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
.box {
  max-width: 500px;
  margin: auto;
}

.error {
  color: red;
}

.forgot-password-box {
  margin-top: 1em;
}
</style>
