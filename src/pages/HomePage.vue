<template>
  <h1>HOME!</h1>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";

export default {
  name: "HomePage",
  components: {},
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.isAuthenticated)
      return {name: "explore"};
  }
};
</script>
<style scoped>

</style>
