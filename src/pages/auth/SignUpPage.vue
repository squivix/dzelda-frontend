<template>
  <BaseCard title="Sign Up" id="signup-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <label for="email">Email</label>
        <input id="email" type="email" required v-model="email"
               :class="{'error-input': errorFields.includes('email')}"/>
        <label for="username">Username</label>
        <input id="username" type="text" required v-model="username"
               :class="{'error-input': errorFields.includes('username')}"/>
        <label for="new-password">Password</label>
        <BasePasswordInput
            id="new-password"
            :class="{'error-input': errorFields.includes('password')}"
            autocomplete="new-password"
            :required="true"
            v-model="password"/>
        <p class="error-message">{{ errorMessage }}</p>
        <SubmitButton id="signup-button"
                      class="primary-filled-button capsule-button"
                      :is-submitting="isSubmitting"
                      :keep-text="true">
          Sign Up
        </SubmitButton>
      </form>
    </template>
  </BaseCard>
</template>
<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default {
  name: "SignUpPage",
  components: {SubmitButton, BaseCard, BasePasswordInput},
  data() {
    return {
      email: "",
      username: "",
      password: "",
      errorFields: [] as Array<"email" | "username" | "password">,
      errorMessage: "",
      isSubmitting: false,
    };
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      const error = await this.userStore.signUp({
        username: this.username,
        email: this.email,
        password: this.password
      });
      this.isSubmitting = false;
      if (error) {
        this.messageBarStore.addMessage({type: MessageType.ERROR, text: error.message!});
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
