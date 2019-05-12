<template>
  <div>
    <b-loading :active="isLoading"/>
    <section v-if="user" class="section">
      <div class="box">
        <h1 class="title"> {{$t('register.title')}} </h1>
        <p v-if="error" class="error">{{$t('error.invalid-credentials')}}</p>
        <p v-if="hasNext" class="error">{{$t('error.must-be-authenticated')}}</p>

        <form @submit.prevent="register">
          <b-field  :label="$t('label.username')"
                    :type="{'is-danger': errors.has('username')}"
                    :message="errors.first('username')">
            <b-input v-model="user.username" v-validate="'required'" name="username"/>
          </b-field>

          <b-field  password-reveal
                    :label="$t('label.password')"
                    :type="{'is-danger': errors.has('password')}"
                    :message="errors.first('password')">
            <b-input v-model="user.password"
                     password-reveal type="password"
                     v-validate="{ required: true, min: 8}"
                     name="password" ref="password"/>
          </b-field>

          <b-field  :label="$t('label.confirmPassword')"
                    :type="{'is-danger': errors.has('confirm-password')}"
                    :message="errors.first('confirm-password')">
            <b-input v-model="confirmPassword"
                     password-reveal type="password"
                     v-validate="'required|confirmed:password'"
                     name="password"
                     :disabled="!user.password"/>
          </b-field>
          <p> {{$t('label.passwordHint')}} </p>

          <b-field :label="$t('label.name')"
                   :type="{'is-danger': errors.has('name')}"
                   :message="errors.first('name')">
            <b-input v-model.trim="user.name" v-validate="'required'" name="name"/>
          </b-field>

          <b-field :label="$t('label.surname')"
                   :type="{'is-danger': errors.has('surname')}"
                   :message="errors.first('surname')">
            <b-input v-model.trim="user.surname" v-validate="'required'" name="surname"/>
          </b-field>

          <b-field :label="$t('label.email')"
                   :type="{'is-danger': errors.has('email')}"
                   :message="errors.first('email')">
            <b-input v-model.trim="user.email" type="email" v-validate="'required|email'" name="email"/>
          </b-field>

          <p class="control">
            <button class="button is-primary is-fullwidth">
              {{ $t('button.register') }}
            </button>
          </p>
        </form>

        <router-link tag="button" class="button is-light is-fullwidth" :to="{name: 'login'}">
          {{ $t('button.toggleLogin') }}
        </router-link>

      </div>
    </section>
  </div>
</template>

<script>
import User from '../utils/api/User';

export default {
  name: 'LoginPage',

  data() {
    return {
      user : null,
      confirmPassword:'',
      error: false,
      registering: false,
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
    async register() {
      let result = await this.validate();

      if (!result) {
        return;
      }

      try {
        await this.user.save();
        this.$toast.open({
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
</style>
