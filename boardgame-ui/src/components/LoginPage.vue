<template>
  <div class="box">
    <h1 class="title">{{$t('login.title')}}</h1>
    <p v-if="error" class="error">{{$t('error.invalid-credentials')}}</p>
    <p v-else-if="hasNext" class="error">{{$t('error.must-be-authenticated')}}</p>
    <form @submit.prevent="login()">
      <b-field :label="$t('label.username')">
        <b-input v-model="username"></b-input>
      </b-field>
      <b-field :label="$t('label.password')">
        <b-input v-model="password" type="password"></b-input>
      </b-field>
      <p class="control">
        <button class="button is-primary is-fullwidth">{{$t('button.login')}}</button>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: false
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
      return {username: this.username, password: this.password};
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', this.credentials);
        this.$router.push(this.next);
      }
      catch(error) {
        console.log(error);
        this.error = true;
      }
    }
  }
};
</script>


<style>
.box {
  max-width: 500px;
  margin: auto;
}

.error {
  color: red;
}
</style>
