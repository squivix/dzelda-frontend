<template>
  <base-card title="Login" id="login-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          required
          v-model="username"
          :class="{
            'error-input': !!error,
          }"
        />
        <label for="new-password">Password</label>
        <base-password-input
          v-model="password"
          id="current-password"
          autocomplete="current-password"
          required
          :class="{
            'error-input': !!error,
          }"
        ></base-password-input>
        <router-link to="forgot-password" id="forgot-password-link" class="link"
          >Forgot Password?</router-link
        >
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button id="login-button" class="primary-button" type="submit">
          Login
        </button>
      </form>
    </template>
  </base-card>
</template>
<script>
import * as utils from '../../utils.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  computed: {
    errorMessage() {
      if (!this.error) return null;
      if (this.error === 'Failed to fetch')
        return 'Connection issue: failed to fetch from server';
      const JSONMessage = utils.isJsonString(this.error);
      if (
        JSONMessage &&
        JSONMessage.non_field_errors.includes(
          'Unable to log in with provided credentials.'
        )
      )
        return 'Username or password is incorrect';
      else return this.error;
    },
  },
  methods: {
    async submitForm() {
      this.error = null;
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          username: this.username,
          password: this.password,
        });
      } catch (error) {
        this.error = error.message;
        return;
      }
      // this.$router.push({name:"explore", params:{learningLanguage:await this.$state.dispatch('getDefaultLanguage')}})
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
.base-password-div >>> input {
  border: none;
  outline: 1px solid black;
}
input,
.base-password-div {
  margin-bottom: 1.5rem;
}

#forgot-password-link {
  margin-top: -1rem;
  margin-bottom: 1.5rem;
}
#login-button {
  margin-top: 1rem;
}

.error-input,
.base-password-div >>> .error-input {
  border: none;
  outline: 2px solid red;
}
.error-input:focus-visible,
.base-password-div >>> .error-input:focus-visible {
  outline: 1px solid red;
  box-shadow: 0px 0px 3px 2px red;
}

.error-message {
  color: red;
}
</style>