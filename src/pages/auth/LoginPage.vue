<template>
  <BaseCard title="Login" id="login-card">
    <template v-slot:content>
      <form @submit.prevent="submitForm">
        <label for="username">Username</label>
        <input
            id="username"
            type="text"
            required
            v-model="username"
            autocomplete="username"
            :class="{'error-input': errorFields.includes('username')}"/>
        <label for="current-password">Password</label>
        <BasePasswordInput
            v-model="password"
            id="current-password"
            autocomplete="current-password"
            required
            :class="{'error-input': errorFields.includes('password')}">
        </BasePasswordInput>
        <router-link :to="{name:'reset-password'}" id="forgot-password-link" class="link">
          Forgot Password?
        </router-link>
        <p class="error-message">{{ errorMessage }}</p>
        <button id="login-button" class="primary-filled-button capsule-button" type="submit">
          Login
        </button>
      </form>
    </template>
  </BaseCard>
</template>
<script lang="ts">
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import BaseCard from "@/components/ui/BaseCard.vue";

export default {
  name: "LoginPage",
  components: {BaseCard, BasePasswordInput},
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      errorFields: [] as Array<"username" | "password">
    };
  },
  computed: {},
  methods: {
    async submitForm() {
      this.errorMessage = "";
      const error = await this.userStore.login({
        username: this.username,
        password: this.password,
      });
      if (error !== undefined) {
        this.messageBarStore.addMessage({text: error.message, type: MessageType.ERROR});
        this.errorMessage = error.message;
        if ("fields" in error && error.fields !== undefined)
          this.errorFields = Object.keys(error.fields) as Array<"username" | "password">;
        else
          this.errorFields = ["username", "password"];
      } else
        await this.$router.push({name: "explore"});
    },
  },
  setup() {
    return {
      userStore: useUserStore(),
      messageBarStore: useMessageBarStore()
    };
  },
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.isAuthenticated)
      return {name: "home"};
  }
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
.base-password-div:deep(input) {
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

#forgot-password-link {
  align-self: flex-start;
  margin-top: 0.1rem;
  color: black;
}

</style>
