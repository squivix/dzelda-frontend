<template>
  <p class="submit-message">
    Confirming Email...
    <br><br>
    You will be redirected shortly.
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
    return {};
  },
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.userAccount!.isEmailConfirmed)
      return {name: "home"};
  },
  async mounted() {
    if (!this.queryParams.token) {
      this.messageBarStore.addMessage({type: MessageType.ERROR, text: "No email token provided"});
      this.$router.push({name: "home"});
    } else {
      const isConfirmSuccessful = await this.userStore.confirmEmail({token: this.queryParams.token});
      if (isConfirmSuccessful) {
        await this.userStore.fetchUserAccount(true);
        this.messageBarStore.addMessage({type: MessageType.SUCCESS, text: "Email confirmed"});
        this.$router.push({name: "explore"});
      } else {
        this.$router.push({query: {...this.$route.query, token: undefined}})
        this.queryParams.token = undefined;
        this.messageBarStore.addMessage({type: MessageType.ERROR, text: "Email reset token is invalid or expired"});
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

#confirm-email-card {
  width: 80vw;
  max-width: 800px;
  display: block;
  margin: auto;
}
</style>
