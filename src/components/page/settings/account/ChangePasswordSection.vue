<template>
  <section>
    <h3>Change Password</h3>

    <p v-if="changeSuccessful">
      Your password was changed successfully.
      <br><br>
      You will be logged out of all other devices.
    </p>
    <form class="change-password-form" @submit.prevent="submitPasswordChange" v-else>
      <!--Apparently important for password managers, see: https://goo.gl/9p2vKq#use-hidden-fields-for-implicit-information -->
      <input name="username" disabled hidden type="text" autocomplete="username">

      <label for="old-password">Old Password</label>
      <BasePasswordInput v-model="oldPassword"
                         id="old-password"
                         autocomplete="current-password"
                         required
                         :min-length="1"
                         :class="{'error-input': !!errorFields.oldPassword}"/>
      <label for="new-password">New Password</label>
      <BasePasswordInput v-model="newPassword"
                         id="new-password"
                         autocomplete="new-password"
                         :min-length="8"
                         required
                         :class="{'error-input': !!errorFields.newPassword}"/>
      <label for="repeat-new-password">Confirm New Password</label>
      <BasePasswordInput v-model="repeatNewPassword"
                         id="repeat-new-password"
                         :min-length="8"
                         autocomplete="new-password"
                         required/>

      <p v-if="errorFields.newPassword" class="error-message">{{ errorFields.newPassword }}</p>
      <p v-else-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <SubmitButton class="change-password-button primary-filled-button capsule-button"
                    :is-submitting="isSubmitting">
        Change Password
      </SubmitButton>
    </form>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "ChangePasswordSection",
  components: {SubmitButton, BasePasswordInput},
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      errorFields: { oldPassword: "", newPassword: "" },
      changeSuccessful: false,
      errorMessage: "",
      isSubmitting: false,
    };
  },
  methods: {
    async submitPasswordChange() {
      this.errorFields = { oldPassword: "", newPassword: "" };
      this.errorMessage = "";
      if (this.repeatNewPassword !== this.newPassword) {
        this.errorMessage = "Passwords do not match";
        return;
      }
      this.isSubmitting = true;
      const error = await this.userStore.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });
      this.isSubmitting = false;
      if (!error) {
        this.changeSuccessful = true;
        this.errorMessage = "";
        this.messageBarStore.addMessage({text: "Password changed", type: MessageType.SUCCESS});
      } else {
        if (error.code == 400)
          this.errorFields = error.fields! as { oldPassword: string, newPassword: string };
        this.errorMessage = error.message;
      }
    }
  },
  setup() {
    return {
      userStore: useUserStore(),
      messageBarStore: useMessageBarStore()
    };
  }
});
</script>

<style scoped>

.change-password-form {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;

}

.change-password-button {
  font-size: 0.8rem;
  align-self: flex-start;
}

</style>
