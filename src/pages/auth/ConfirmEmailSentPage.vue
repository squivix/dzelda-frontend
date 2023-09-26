<template>
  <p class="submit-message">
    We've sent you a confirmation link. Please check your email.
    <br><br>
    Didn't receive the email? Link expired?
    <RouterLink :to="{name:'resend-confirm-email'}">Click here to resend</RouterLink>
  </p>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ConfirmEmailSentPage"
});
</script>

<style scoped>

</style>
