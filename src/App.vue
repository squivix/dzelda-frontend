<template>
  <component v-if="$route.meta.showHeader" :is="userStore.isAuthenticated ? 'auth-header' : 'guest-header'"/>
  <TheMessageBarQueue class="message-bar-queue"/>

  <main>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path"/>
    </router-view>
  </main>

  <TheFooter v-if="$route.meta.showFooter"/>

</template>
<script lang="ts">
import GuestHeader from "@/components/layout/GuestHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import AuthHeader from "@/components/layout/AuthHeader.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import TheMessageBarQueue from "@/components/layout/TheMessageBarQueue.vue";


export default {
  components: {
    TheMessageBarQueue,
    GuestHeader,
    AuthHeader,
    TheFooter,
  },
  setup() {
    return {userStore: useUserStore()};
  }
};
</script>
<style>
@import './assets/styles/reset.css';
@import './assets/styles/common.css';
</style>

<style scoped>
header {
  grid-column: 1 / 4;
}

.message-bar-queue {
  margin-bottom: 3rem;
  grid-column: 1 / 4;
}


main {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

footer {
  grid-column: 1 / 4;
}
</style>
