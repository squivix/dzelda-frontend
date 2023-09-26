<template>
  <h1>HOME!</h1>
</template>

<script lang="ts">
import {useAuthStore} from "@/stores/backend/authStore.js";

export default {
  name: "HomePage",
  components: {},
  beforeRouteEnter() {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated)
      return {name: "explore"};
  }
};
</script>
<style scoped>

</style>
