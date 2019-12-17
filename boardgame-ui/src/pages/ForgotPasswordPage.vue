<template>
  <div class="container">
    <b-loading :is-full-page="false" :active="isLoading" />
    <section class="section">
      <div class="box">
        <h1 class="title">{{$t('login.link.forgot-password')}}</h1>
        <form @submit.prevent="validateBeforeSubmit">
          <b-field
                  :label="$t('label.email')"
                  :type="{'is-danger': errors.has('email')}"
                  :message="errors.first('email')">
            <b-input v-model.trim="email" type="email" v-validate="'required|email'" name="email"></b-input>
          </b-field>

          <p class="control">
            <button class="button is-primary is-fullwidth">
              {{$t('label.submit')}}
            </button>
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import User from '@/utils/api/User';

export default {

  data() {
    return {
      email: '',
      error: false,
      isLoading: false,
    };
  },

  methods: {
    validateBeforeSubmit() {
      this.isLoading = true;
      this.$validator.validateAll().then(async (valid) => {
        if (valid) {
          await this.submitForgotPassword(this.email);
        }
        this.isLoading = false;
      });
    },

    async submitForgotPassword(email) {
      try {
        await User.forgotPassword(email);
      }
      catch (error) {
        console.log(error);
        this.$buefy.toast.open({
          message: this.$t('login.toast.forgot-password.failure'),
          type: 'is-danger',
          position: 'is-bottom',
        });
        return;
      }

      this.$buefy.toast.open({
        message: this.$t('login.toast.forgot-password.success'),
        type: 'is-success',
        position: 'is-bottom',
        duration: 4000,
      });

      this.$router.push({name: 'login'});
    }
  },
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
