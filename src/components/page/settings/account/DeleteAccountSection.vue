<template>
  <section>
    <h3>Delete Account</h3>
    <button class="delete-account-button primary-filled-button capsule-button" @click="submitDeleteAccount">Delete
      Account
    </button>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";

export default defineComponent({
  name: "DeleteAccountSection",
  methods: {
    async submitDeleteAccount() {
      //TODO replace with modal dialog
      if (confirm("Are you sure you want to delete your account?\n\n(This action cannot be undone)")) {
        await this.userStore.deleteAccount();

      }
    }
  },
  setup() {
    return {
      userStore: useUserStore()
    };
  }
});
</script>

<style scoped>
.delete-account-button {
  background-color: #CA0B00;
  border-color: #CA0B00;
  align-self: flex-start;
}
</style>
