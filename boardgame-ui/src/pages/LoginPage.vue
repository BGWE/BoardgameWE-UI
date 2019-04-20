<template>
  <div>
    <b-loading :active="isLoading"></b-loading>
    <section v-if="user" class="section">
      <div class="box">
        <h1 class="title">{{titleText}}</h1>
        <p v-if="error" class="error">{{$t('error.invalid-credentials')}}</p>
        <p v-if="hasNext" class="error">{{$t('error.must-be-authenticated')}}</p>

        <form @submit.prevent="validateBeforeSubmit">
          <b-field  :label="$t('label.username')"
                    :type="{'is-danger': errors.has('username')}"
                    :message="errors.first('username')">
            <b-input v-model="user.username" v-validate="'required'" name="username"></b-input>
          </b-field>

          <b-field  password-reveal
                    :label="$t('label.password')"
                    :type="{'is-danger': errors.has('password')}"
                    :message="errors.first('password')">
            <b-input v-model="user.password"
                     password-reveal type="password"
                     v-validate="{ required: true, min: this.registering ? 8 : 0 }"
                     name="password" ref="password"></b-input>
          </b-field>

          <b-field  v-if="registering"
                    :label="$t('label.confirmPassword')"
                    :type="{'is-danger': errors.has('confirm-password')}"
                    :message="errors.first('confirm-password')">
            <b-input v-model="confirmPassword"
                     password-reveal type="password"
                     v-validate="'required|confirmed:password'"
                     name="password"
                     :disabled="!user.password"></b-input>
          </b-field>
          <p v-if="registering">{{$t('label.passwordHint')}}</p>

          <b-field v-if="registering"
                   :label="$t('label.name')"
                   :type="{'is-danger': errors.has('name')}"
                   :message="errors.first('name')">
            <b-input v-model.trim="user.name" v-validate="'required'" name="name"></b-input>
          </b-field>

          <b-field v-if="registering"
                   :label="$t('label.surname')"
                   :type="{'is-danger': errors.has('surname')}"
                   :message="errors.first('surname')">
            <b-input v-model.trim="user.surname" v-validate="'required'" name="surname"></b-input>
          </b-field>

          <b-field v-if="registering"
                   :label="$t('label.email')"
                   :type="{'is-danger': errors.has('email')}"
                   :message="errors.first('email')">
            <b-input v-model.trim="user.email" type="email" v-validate="'required|email'" name="email"></b-input>
          </b-field>

          <p class="control">
            <button class="button is-primary is-fullwidth">
              {{submitButtonText}}
            </button>
          </p>
        </form>

        <button class="button is-light is-fullwidth" v-on:click="toggleRegister">
          {{toggleButtonText}}
        </button>

        <!-- <button v-if="!registering" class="button is-info is-fullwidth" v-on:click="isForgotPasswordModalActive = !isForgotPasswordModalActive">
          {{$t('login.link.forgot-password')}}
        </button> -->

        <div v-if="!registering" class="forgot-password-box has-text-link">
          <router-link :to="{name: 'forgot-password'}">
            {{$t('login.link.forgot-password')}}
          </router-link>
        </div>
        

        <!-- <b-modal :active="isForgotPasswordModalActive" scroll="keep" width="510px">
          <ForgotPasswordModal @cancel="closeForgotPasswordModal" @submit="submitForgotPassword" :email="forgotPasswordEmail"/>
        </b-modal> -->
      </div>
    </section>
  </div>
</template>

<script>
import User from '@/utils/api/User';
import Authentication from '@/utils/api/Authentication';

import ForgotPasswordModal from '@/components/authentication/ForgotPasswordModal';

export default {
  name: 'LoginPage',

  components: {
    ForgotPasswordModal
  },

  data() {
    return {
      user : null,
      confirmPassword:'',
      forgotPasswordEmail: '',
      error: false,
      registering: false,
      isLoading: true,
      isForgotPasswordModalActive: false
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
    },
    titleText() {
      return this.registering ? this.$t('login.title.register') : this.$t('login.title.login');
    },
    submitButtonText() {
      return this.registering ? this.$t('button.register') : this.$t('button.login');
    },
    toggleButtonText() {
      return this.registering ? this.$t('button.toggleLogin') : this.$t('button.toggleRegister');
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
        this.error = true;
        this.isLoading = false;
      }
    },

    async register() {
      try {
        await this.user.save();
        this.toggleRegister();
      }
      catch (error) {
        console.log(error);
        this.error = true;
      }
    },

    validateBeforeSubmit() {
      this.$validator.validateAll().then(async (valid) => {
        if (valid) {
          if (this.registering) {
            try {
              await this.register();
              this.$toast.open({
                message: this.$t('login.toast.register.success'),
                type: 'is-success',
                position: 'is-bottom'
              });
              this.toggleRegister();
            }
            catch (e) {
              console.log(e);
            }
          }
          else {
            try {
              console.log('Trying to login');
              this.login();
            }
            catch (e) {
              console.log(e);
            }
          }
        }
      });
    },

    toggleRegister() {
      this.registering = !this.registering;
    },
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
