<template>
  <h1>HOME!</h1>
  <TryItSection/>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";
import TryItSection from "@/pages/home/TryItSection.vue";

export default {
  name: "HomePage",
  components: {TryItSection},
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.isAuthenticated)
      return {name: "explore"};
  }
};
</script>
<style scoped>

</style>
