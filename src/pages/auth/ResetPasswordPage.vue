<template>
  <BaseCard title="Reset Password" id="reset-password-card">
    <template v-slot:content>
      <p class="submit-message" v-if="!tokenIsValid">Password reset token is expired or invalid.
        Please request another
        <router-link :to="{name:'reset-password-request'}">here</router-link>
        .
      </p>
      <form @submit.prevent="submitForm" v-else-if="!resetSuccessful">
        <label for="new-password">New Password</label>
        <BasePasswordInput
            v-model="newPassword"
            id="new-password"
            required
            :class="{'error-input': errorFields.includes('newPassword')}"/>
        <label for="repeat-new-password">Confirm New Password</label>
        <BasePasswordInput
            v-model="repeatNewPassword"
            id="repeat-new-password"
            required/>

        <p class="error-message">{{ errorMessage }}</p>

        <SubmitButton id="reset-password-button"
                      class="primary-filled-button big-button capsule-button"
                      type="submit"
                      :is-submitting="isSubmitting">
          Reset Password
        </SubmitButton>

      </form>

      <p class="submit-message" v-else>Password reset successfully.
        <RouterLink :to="{name:'login'}">Login</RouterLink>
      </p>

    </template>
  </BaseCard>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "ResetPasswordPage",
  components: {SubmitButton, BasePasswordInput, BaseCard},
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
      isSubmitting: false,
    };
  },
  methods: {
    async validateToken() {
      if (this.queryParams.token === "") {
        this.$router.push({name: "reset-password-request"});
        return;
      }
      const isValid = await this.userStore.validatePasswordResetToken({token: this.queryParams.token});
      if (!isValid)
        this.tokenIsValid = false;
    },
    async submitForm() {
      this.errorMessage = "";
      if (!this.tokenIsValid || !this.queryParams.token) {
        return;
      }
      if (this.repeatNewPassword !== this.newPassword) {
        this.errorMessage = "Passwords do not match";
        return;
      }
      this.isSubmitting = true;
      const response = await this.userStore.resetPassword({
        token: this.queryParams.token,
        newPassword: this.newPassword,
      });
      if (response.ok)
        this.resetSuccessful = true;
      else {
        const error = response.error;
        if (error.code == 400)
          this.errorMessage = (error.fields as { newPassword: string }).newPassword;
        else
          this.errorMessage = error.message;

      }
      this.isSubmitting = false;
    },

  },
  setup() {
    return {
      userStore: useUserStore(),
    };
  },
  async mounted() {
    await this.validateToken();
  }

});
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

</style>
