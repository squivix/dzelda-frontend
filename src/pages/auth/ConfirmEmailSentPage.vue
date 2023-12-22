<template>
  <div>
    <h2>We've sent you a confirmation link. Please check your email.</h2>
    <br>
    <p>
      Didn't receive the email? Link expired?
      <br>
      <RouterLink :to="{name:'resend-confirm-email'}">Click here to resend</RouterLink>
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";

export default defineComponent({
  name: "ConfirmEmailSentPage",
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.userAccount!.isEmailConfirmed)
      return {name: "home"};
  },
});
</script>

<style scoped>

div {
  text-align: center;
  color: grey;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
}

p {
  font-size: 1.1rem;
}
</style>
