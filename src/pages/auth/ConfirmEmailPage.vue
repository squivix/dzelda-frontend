<template>
  <p class="submit-message">
    Confirming...
    <br><br>
    You will be redirected shortly.
  </p>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseChangeableInput from "@/components/ui/BaseChangeableInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useAuthStore} from "@/stores/backend/authStore.js";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export default defineComponent({
  name: "ConfirmEmailPage",
  components: {BaseChangeableInput},
  data() {
    return {};
  },

  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.userAccount!.isEmailConfirmed)
      return {name: "explore"};
  },
  async mounted() {
    if (typeof this.queryParams.token !== "string" || this.queryParams.token === "")
      this.queryParams.token = undefined;
    else {
      const isConfirmSuccessful = await this.authStore.confirmEmail({token: this.queryParams.token});
      if (isConfirmSuccessful) {
        await this.userStore.fetchUserAccount(true);
        this.messageBarStore.addMessage({type: MessageType.SUCCESS, text: "Email confirmed"});
        this.$router.push({name: "explore"});
      } else {
        this.queryParams.token = undefined;
        this.messageBarStore.addMessage({type: MessageType.ERROR, text: "Email reset token is invalid or expired"});
      }
    }
  },
  setup() {
    return {
      userStore: useUserStore(),
      authStore: useAuthStore(),
      messageBarStore: useMessageBarStore(),
      queryParams: useQuery()
    };
  }
});
</script>

<style scoped>

#confirm-email-card {
  width: 80vw;
  max-width: 800px;
  display: block;
  margin: auto;
}
</style>
