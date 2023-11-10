<template>
  <BaseCard title="Reset Password" id="reset-password-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm" v-if="!submitted">
        <label for="username">Username</label>
        <input
            id="username"
            type="text"
            required
            v-model="username"
        />
        <label for="email">Email</label>
        <input
            id="email"
            type="email"
            required
            v-model="email"
        />

        <button id="reset-password-button" class="primary-filled-button capsule-button" type="submit">
          Reset Password
        </button>

      </form>
      <p class="submit-message" v-else>If the account exists we will send you an email with the reset
        link</p>

    </template>
  </BaseCard>
</template>
<script lang="ts">
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";

export default {
  name: "ResetPasswordRequestPage",
  components: {BasePasswordInput},
  data() {
    return {
      username: '',
      email: '',
      submitted: false,
    }
  },
  methods: {
    async submitForm() {
      await this.userStore.requestPasswordReset({
        username: this.username,
        email: this.email
      });
      this.submitted = true;
    }
  },
  setup() {
    return {
      userStore: useUserStore()
    };
  }
}
</script>

<style scoped>
#reset-password-card {
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

input {
  border: none;
  outline: 1px solid black;
}

input {
  margin-bottom: 1.5rem;
}

#reset-password-button {
  margin-top: 1rem;
}

.submit-message {
  min-height: 1lh;
}
</style>
