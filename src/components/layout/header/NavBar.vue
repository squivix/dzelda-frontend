<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{ name: 'explore' }" class="inv-link">
          Explore
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'my-library' }" class="inv-link">
          My Library
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'my-vocab' }" class="inv-link">
          My Vocab
        </router-link>
      </li>
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
nav {
  align-self: stretch;

}

ul {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 2rem;
  font: 900 1.25rem sans-serif;
  color: var(--on-primary-color);
}

li {
  height: 100%;
}

li:hover {
  cursor: pointer;
}
a{
  display : flex;
  align-items : center;
  height: 100%;
}
a {
  color: inherit;
}

@media screen and (max-width: 750px) {
  nav {
    display: none;
  }
}
</style>
