<template>
  <div id="the-root">
    <component
        :is="isAuthenticated ? 'auth-header' : 'guest-header'">
    </component>

    <the-message-bar-queue class="message-bar-queue"></the-message-bar-queue>

    <aside class="left-side"></aside>

    <main>
      <router-view></router-view>
    </main>

    <aside class="right-side"></aside>

    <the-footer v-if="$route.meta.showFooter"></the-footer>
  </div>
</template>
<script lang="ts">
import GuestHeader from "@/components/layout/GuestHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import AuthHeader from "@/components/layout/AuthHeader.vue";
import {useAuthStore} from "@/stores/backend/authStore.js";
import TheMessageBarQueue from "@/components/layout/TheMessageBarQueue.vue";


export default {
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
  },
  components: {
    TheMessageBarQueue,
    GuestHeader,
    AuthHeader,
    TheFooter,
  },
  setup() {
    return {authStore: useAuthStore()};
  }
};
</script>
<style>
@import './assets/styles/reset.css';
@import './assets/styles/common.css';
</style>

<style scoped>
#the-root {
  display: grid;
  grid-template: auto auto 1fr auto / auto 1fr auto;
  height: 100%;
}

header {
  grid-column: 1 / 4;
}

.message-bar-queue {
  grid-column: 2 / 2;
  margin-bottom: 3rem;
}

.left-side {
  grid-column: 1 / 2;
}

main {
  grid-column: 2 / 3;
  justify-self: center;
}

.right-side {
  grid-column: 3 / 4;
}

footer {
  grid-column: 1 / 4;
}
</style>