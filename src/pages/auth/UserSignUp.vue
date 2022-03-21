<template>
  <base-card title="Sign Up" id="signup-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <label for="email">Email</label>
        <input id="email" type="email" required v-model="email" />
        <label for="username">Username</label>
        <input id="username" type="text" required v-model="username" />
        <label for="new-password">Password</label>
        <base-password-input
          id="new-password"
          autocomplete="new-password"
          :required="true"
          v-model="password"
        ></base-password-input>
        <button id="signup-button" class="primary-button" type="submit">
          Sign Up
        </button>
      </form>
    </template>
  </base-card>
</template>
<script>
export default {
  data() {
    return {
      email: '',
      username: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
      this.$store.dispatch('signUp', {
        email: this.email,
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>
<style scoped>
#signup-card {
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
#signup-button {
  margin-top: 1rem;
}
</style>