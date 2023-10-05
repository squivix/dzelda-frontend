<template>
  <base-card title="Sign Up" id="signup-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <label for="email">Email</label>
        <input id="email" type="email" required v-model="email"
               :class="{'error-input': errorFields.includes('email')}"/>
        <label for="username">Username</label>
        <input id="username" type="text" required v-model="username"
               :class="{'error-input': errorFields.includes('username')}"/>
        <label for="new-password">Password</label>
        <base-password-input
            id="new-password"
            :class="{'error-input': errorFields.includes('password')}"
            autocomplete="new-password"
            :required="true"
            v-model="password"/>
        <p class="error-message">{{ errorMessage }}</p>
        <button id="signup-button" class="primary-button" type="submit">
          Sign Up
        </button>
      </form>
    </template>
  </base-card>
</template>
<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export default {
  name: "SignUpPage",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      errorFields: [] as Array<"email" | "username" | "password">,
      errorMessage: "",
    };
  },

  methods: {
    async submitForm() {
      const error = await this.userStore.signUp({
        username: this.username,
        email: this.email,
        password: this.password
      });
      if (error) {
        this.messageBarStore.addMessage({type: MessageType.ERROR, text: error.message!})
        this.errorMessage = error.message;
        this.errorFields = Object.keys(error.fields!) as Array<"email" | "username" | "password">;
      } else
        this.$router.push({name: "confirm-email"});
    },
  },
  mounted() {
  },
  setup() {
    return {
      userStore: useUserStore(),
      languageStore: useLanguageStore(),
      messageBarStore: useMessageBarStore()
    };
  }
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

input, .base-password-div,
select {
  margin-bottom: 1.5rem;
}

#signup-button {
  margin-top: 1rem;
}
</style>
