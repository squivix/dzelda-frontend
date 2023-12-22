<template>
  <nav>
    <ul>
      <router-link :to="{ name: 'explore' }">
        <li>Explore</li>
      </router-link>
      <router-link :to="{ name: 'my-library' }">
        <li>My Library</li>
      </router-link>
      <router-link :to="{ name: 'my-vocab' }">
        <li>My Vocab</li>
      </router-link>
    </ul>
  </nav>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default defineComponent({
  name: "NavBar", computed: {
    userAccount() {
      return this.userStore.userAccount;
    },
    userLanguages() {
      return this.languageStore.userLanguages;
    },
  },
  setup() {
    return {
      userStore: useUserStore(),
      languageStore: useLanguageStore(),
    };
  }
});
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: none;
}

nav > ul {
  display: flex;
  flex-direction: row;
  column-gap: 2rem;
  font: 900 1.25rem sans-serif;
  color: var(--on-primary-color);
}

nav > ul > li:hover {
  cursor: pointer;
}

@media screen and (max-width: 750px) {
  nav{
    display: none;
  }
}
</style>
