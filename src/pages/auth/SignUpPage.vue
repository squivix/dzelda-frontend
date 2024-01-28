<template>
  <BaseCard title="Sign Up" id="signup-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" type="email" maxlength="256"  required v-model="email"
                 :class="{'error-input': !!errorFields.email}"/>
          <p v-if="errorFields.email" class="error-message">{{ errorFields.email }}</p>
        </div>
        <div class="form-row">
          <label for="username">Username</label>
          <input id="username" type="text" minlength="4" required pattern="[A-Za-z0-9_]+" title="Please only use alphanumerical characters or underscore (A-Z,a-z,0-9,_)." v-model="username"
                 :class="{'error-input': !!errorFields.username}"/>
          <p v-if="errorFields.username" class="error-message">{{ errorFields.username }}</p>
        </div>
        <div class="form-row">
          <label for="new-password">Password</label>
          <BasePasswordInput
              id="new-password"
              :class="{'error-input': !!errorFields.password}"
              autocomplete="new-password"
              :required="true"
              :min-length="8"
              v-model="password"/>
          <p v-if="errorFields.password" class="error-message">{{ errorFields.password }}</p>
        </div>
        <SubmitButton id="signup-button"
                      class="primary-filled-button big-button capsule-button"
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
      errorFields: {"email": "", "username": "", "password": ""},
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
      if (error)
        this.errorFields = error.fields! as { "email": string, "username": string, "password": string };
      else
        this.$router.push({name: "confirm-email"});
    },
  },
  mounted() {
  },
  setup() {
    return {
      userStore: useUserStore(),
      languageStore: useLanguageStore(),
    };
  }
};
</script>
<style scoped>
#signup-card {
  width: 80vw;
  max-width: 800px;
  display: block;
}

form {
  display: flex;
  flex-direction: column;
  margin-right: 0;
  padding: 0 10%;
  row-gap: 1rem;
}

label {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.form-row {
  display: flex;
  flex-direction: column;
}

input, .base-password-div {
  margin-bottom: 0.5rem;
}

</style>
