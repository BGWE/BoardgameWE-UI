<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">{{$t('login.link.forgot-password')}}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Email">
          <b-input
              type="email"
              v-model="email"
              placeholder="Your email"
              required>
          </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
        <button class="button" type="button" @click="$emit('cancel')">{{$t('label.cancel')}}</button>
        <button class="button is-primary" @click="$emit('submit', email)">{{$t('label.submit')}}</button>
    </footer>
  </div>
</template>

<script>
import Authentication from '@/utils/api/Authentication';

export default {
  name: 'ForgotPasswordModal',

  data() {
    return {
      email: '',
    };
  },

  methods: {
    
  },
};

</script>