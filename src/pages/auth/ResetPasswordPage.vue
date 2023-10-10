<template>
  <base-card title="Reset Password" id="reset-password-card">
    <template v-slot:content>
      <p class="submit-message" v-if="!tokenIsValid">Password reset token is expired or invalid.
        Please request another
        <RouterLink :to="{name:'reset-password-request'}">here</RouterLink>
        .
      </p>
      <form @submit.prevent="submitForm" v-else-if="!resetSuccessful">
        <label for="new-password">New Password</label>
        <base-password-input
            v-model="newPassword"
            id="new-password"
            required
            :class="{'error-input': errorFields.includes('newPassword')}">
        </base-password-input>
        <label for="repeat-new-password">Confirm New Password</label>
        <base-password-input
            v-model="repeatNewPassword"
            id="repeat-new-password"
            required>
        </base-password-input>
        <p class="error-message">{{ errorMessage }}</p>

        <button id="reset-password-button" class="primary-filled-button capsule-button" type="submit">
          Reset Password
        </button>

      </form>

      <p class="submit-message" v-else>Password reset successfully.
        <RouterLink :to="{name:'login'}">Login</RouterLink>
      </p>

    </template>
  </base-card>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";

export default defineComponent({
  name: "ResetPasswordPage",
  components: {BasePasswordInput},
  props: {
    queryParams: {
      type: Object as PropType<{ token: string }>,
      required: true
    }
  },
  data() {
    return {
      newPassword: "",
      repeatNewPassword: "",
      errorMessage: "",
      errorFields: [] as string[],
      resetSuccessful: false,
      tokenIsValid: true,
    }
  },
  methods: {
    async validateToken() {
      if (this.queryParams.token === "") {
        this.$router.push({name: "reset-password-request"})
        return
      }
      const isValid = await this.userStore.validatePasswordResetToken({token: this.queryParams.token});
      if (!isValid)
        this.tokenIsValid = false;
    },
    async submitForm() {
      this.errorMessage = "";
      if (!this.tokenIsValid || !this.queryParams.token) {
        return
      }
      if (this.repeatNewPassword !== this.newPassword) {
        this.errorMessage = "Passwords do not match";
        return
      }
      this.resetSuccessful = await this.userStore.resetPassword({
        token: this.queryParams.token,
        newPassword: this.newPassword,
      })
    },

  },
  setup() {
    return {
      userStore: useUserStore(),
    }
  },
  async mounted() {
    await this.validateToken()
  }

})
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

#reset-password-button {
  margin-top: 1rem;
}

.submit-message {
  min-height: 1lh;
}

.error-message {
  color: red;
  min-height: 1lh;
}
</style>
