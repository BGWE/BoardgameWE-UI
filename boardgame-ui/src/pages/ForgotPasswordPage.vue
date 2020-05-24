<template>
  <div class="container">
    <b-loading :is-full-page="false" :active="isLoading" />
    <section class="section">
      <div class="box">
        <h1 class="title">{{$t('login.link.forgot-password')}}</h1>
        <validation-observer v-slot="{ handleSubmit }" >
          <form @submit.prevent="handleSubmit(submitForgotPassword)">
             <InputWithValidation
              rules="required|email"
              :label="$t('label.email')"
              v-model.trim="email"
            />

            <p class="control">
              <button class="button is-primary is-fullwidth">
                {{$t('label.submit')}}
              </button>
            </p>
          </form>
        </validation-observer>
      </div>
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
      email: '',
      error: false,
      isLoading: false,
    };
  },

  methods: {
    async submitForgotPassword() {
      this.isLoading = true;
      try {
        await User.forgotPassword(this.email);
      }
      catch (error) {
        console.log(error);
        this.$buefy.toast.open({
          message: this.$t('login.toast.forgot-password.failure'),
          type: 'is-danger',
          position: 'is-bottom',
        });
        this.isLoading = false;
        return;
      }

      this.$buefy.toast.open({
        message: this.$t('login.toast.forgot-password.success'),
        type: 'is-success',
        position: 'is-bottom',
        duration: 4000,
      });

      this.$router.push({name: 'login'});
      this.isLoading = false;
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
