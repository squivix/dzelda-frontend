<template>
  <h1>Signing out...</h1>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";

export default {
  name: "SignOutPage",
  async created() {
    const userStore = useUserStore();
    await userStore.signOut();
    await this.$router.push({name: 'home'});
  },
};
</script>
<style scoped>

</style>
