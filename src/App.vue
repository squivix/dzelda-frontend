<template>
  <component v-if="$route.meta.showHeader" :is="userStore.isAuthenticated ? 'auth-header' : 'guest-header'"/>
  <MessageBarQueue class="message-bar-queue"/>

  <main>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path"/>
    </router-view>
  </main>

  <TheFooter v-if="$route.meta.showFooter"/>
</template>
<script lang="ts">
import GuestHeader from "@/components/layout/GuestHeader.vue";
import TheFooter from "@/components/layout/Footer.vue";
import AuthHeader from "@/components/layout/AuthHeader.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import MessageBarQueue from "@/components/layout/MessageBarQueue.vue";
import {useLocalSettingsStore} from "@/stores/settingsStore.js";


export default {
  components: {
    MessageBarQueue,
    GuestHeader,
    AuthHeader,
    TheFooter,
  },
  watch: {
    "localSettingsStore.theme": function () {
      document.body.setAttribute("color-scheme", this.localSettingsStore.theme);
    }
  },
  mounted() {
    document.body.setAttribute("color-scheme", this.localSettingsStore.theme);
  },
  setup() {
    return {userStore: useUserStore(), localSettingsStore: useLocalSettingsStore()};
  }
};
</script>
<style>
@import './assets/styles/reset.css';
@import './assets/styles/themes.css';
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
