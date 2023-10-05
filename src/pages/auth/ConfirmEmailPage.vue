<template>
  <p class="submit-message" v-if="!tokenInvalid">
    Confirming Email...
    <br><br>
    You will be redirected shortly.
  </p>
  <p v-else>
    Confirmation link is invalid or expired
    <br><br>
    <router-link :to="{name:'resend-confirm-email'}">Click here to send another</router-link>
  </p>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export default defineComponent({
  name: "ConfirmEmailPage",
  components: {},
  props: {queryParams: {type: Object as PropType<{ token: string }>, required: true}},
  data() {
    return {tokenInvalid: false};
  },
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.userAccount!.isEmailConfirmed)
      return {name: "home"};
  },
  async mounted() {
    if (!this.queryParams.token) {
      this.messageBarStore.addMessage({type: MessageType.ERROR, text: "No email token provided"});
      this.$router.push({name: "confirm-email-sent"});
    } else {
      const isConfirmSuccessful = await this.userStore.confirmEmail({token: this.queryParams.token});
      if (isConfirmSuccessful) {
        await this.userStore.fetchUserAccount(true);
        this.messageBarStore.addMessage({type: MessageType.SUCCESS, text: "Email confirmed"});
        this.$router.push({name: "home"});
      } else {
        this.messageBarStore.addMessage({type: MessageType.ERROR, text: "Email confirm token is invalid or expired"});
        this.tokenInvalid = true;
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
p {
  text-align: center;
}
</style>
