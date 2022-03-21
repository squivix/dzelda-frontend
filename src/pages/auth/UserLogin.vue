<template>
  <base-card title="Login" id="login-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <label for="username">Username</label>
        <input id="username" type="text" required v-model="username" />
        <label for="new-password">Password</label>
        <base-password-input
          id="current-password"
          autocomplete="current-password"
          v-model="password"
        ></base-password-input>
        <router-link to="forgot-password" id="forgot-password-link" class="link"
          >Forgot Password?</router-link
        >
        <button id="login-button" class="primary-button" type="submit">
          Login
        </button>
      </form>
    </template>
  </base-card>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
  this.$store.dispatch('login', {
        email: this.email,
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>
<style scoped>
#login-card {
  width: 80vw;
  max-width: 800px;
  display: block;
  margin: auto;
}
form {
  display: flex;
  flex-direction: column;
  margin-right: 0;
  padding: 0 10%;
}
label {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}
input,
.base-password-input {
  margin-bottom: 1.5rem;
}
#forgot-password-link {
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}
#login-button {
  margin-top: 1rem;
}
</style>