<template>
  <section>
    <h3>Delete Account</h3>
    <button class="delete-account-button primary-button" @click="submitDeleteAccount">Delete Account</button>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useAuthStore} from "@/stores/backend/authStore.js";

export default defineComponent({
  name: "DeleteAccountSection",
  methods: {
    async submitDeleteAccount() {
      //TODO replace with modal dialog
      if (confirm("Are you sure you want to delete your account?\n\n(This action cannot be undone)")) {
        await this.authStore.deleteAccount();
      }
    }
  },
  setup() {
    return {
      authStore: useAuthStore()
    };
  }
});
</script>

<style scoped>
.delete-account-button {
  background-color: #CA0B00;
  align-self: flex-start;
}
</style>
