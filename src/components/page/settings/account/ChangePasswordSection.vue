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
      <base-password-input
          v-model="oldPassword"
          id="old-password"
          autocomplete="current-password"
          required
          :class="{'error-input': errorFields.includes('oldPassword')}">
      </base-password-input>
      <label for="new-password">New Password</label>
      <base-password-input
          v-model="newPassword"
          id="new-password"
          autocomplete="new-password"
          required
          :class="{'error-input': errorFields.includes('newPassword')}">
      </base-password-input>
      <label for="repeat-new-password">Confirm New Password</label>
      <base-password-input
          v-model="repeatNewPassword"
          id="repeat-new-password"
          autocomplete="new-password"
          required>
      </base-password-input>
      <button class="change-password-button primary-filled-button capsule-button">Change Password</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export default defineComponent({
  name: "ChangePasswordSection",
  components: {BasePasswordInput},
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      errorFields: [] as Array<"oldPassword" | "newPassword">,
      changeSuccessful: false,
      errorMessage: "",
    };
  },
  methods: {
    async submitPasswordChange() {
      if (this.repeatNewPassword !== this.newPassword) {
        this.errorMessage = "Passwords do not match";
        return;
      }
      const error = await this.userStore.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });
      if (!error) {
        this.changeSuccessful = true;
        this.messageBarStore.addMessage({text: "Password changed", type: MessageType.SUCCESS});
      } else {
        if (error.code == 400)
          this.errorFields = Object.keys(error.fields!) as Array<"oldPassword" | "newPassword">;
        this.messageBarStore.addMessage({text: error.message, type: MessageType.ERROR});
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