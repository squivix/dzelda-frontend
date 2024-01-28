<template>
  <section>
    <h3>Delete Account</h3>
    <SubmitButton class="delete-account-button danger-button mid-button capsule-button"
                  @click="onDeleteAccountClicked"
                  :is-submitting="isSubmitting">
      Delete Account
    </SubmitButton>
    <SeriousConfirmDialog :is-shown="isConfirmDialogShown"
                          expected-text="delete my account"
                          yes-text="Yes, delete my account"
                          @on-yes-clicked="deleteAccount" @on-no-clicked="isConfirmDialogShown=false">
      <p>Are you sure you want to delete your account?
        <br>
        <br>
        This action cannot be undone. All data related to your account will be deleted as well.</p>
    </SeriousConfirmDialog>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import SeriousConfirmDialog from "@/components/shared/SeriousConfirmDialog.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "DeleteAccountSection",
  components: {SubmitButton, SeriousConfirmDialog},
  data() {
    return {
      isConfirmDialogShown: false,
      isSubmitting: false
    };
  },
  methods: {
    onDeleteAccountClicked() {
      this.isConfirmDialogShown = true;
    },
    async deleteAccount() {
      this.isConfirmDialogShown = false;
      this.isSubmitting = true;
      await this.userStore.deleteAccount();
      this.isSubmitting = false;
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
  align-self: flex-start;
}
</style>
