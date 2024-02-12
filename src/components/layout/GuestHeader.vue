<template>
  <header>
    <div class="main-header">
      <router-link :to="{ name: 'home'}" class="title inv-link">
        <img :src="logoSmall" class="logo-image" alt="logo">
        <h1>Dzelda</h1>
      </router-link>

      <div id="header-buttons">
        <button class="theme-toggle inv-button" @click="onThemeToggleClicked">
          <inline-svg :src="nextThemeIcon!"></inline-svg>
        </button>
        <router-link :to="{ name: 'sign-up' }">
          <button class="auth-button primary-dark-filled-button big-button capsule-button link">Sign Up</button>
        </router-link>
        <router-link :to="{ name: 'login' }">
          <button class="auth-button secondary-filled-button big-button capsule-button link">Login</button>
        </router-link>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import logoSmall from "@/assets/images/logo-small.svg";
import {useLocalSettingsStore} from "@/stores/settingsStore.js";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";

export default {
  name: "GuestHeader",
  components: {InlineSvg},
  computed: {
    nextThemeIcon() {
      if (this.localSettingsStore.theme == "light")
        return icons.blackMode;
      else if (this.localSettingsStore.theme == "black")
        return icons.lightMode;
    }
  },
  methods: {
    onThemeToggleClicked() {
      if (this.localSettingsStore.theme == "light")
        this.localSettingsStore.theme = "black";
      else if (this.localSettingsStore.theme == "black")
        this.localSettingsStore.theme = "light";
    }
  },
  setup() {
    return {
      logoSmall,
      localSettingsStore: useLocalSettingsStore()
    };
  },
};
</script>
<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 5;
}

.main-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2vw;
  background-color: var(--primary-color);
}

.title {
  display: flex;
  align-items: center;
  column-gap: 1rem;
}

.title h1 {
  color: var(--on-primary-color);
  font-family: Verdana, sans-serif;
  font-weight: bold;
  font-size: 2rem;
  padding: 1rem 0;
}

.title:hover {
  text-decoration: none;
}

.logo-image {
  width: 64px;
  height: 64px;
  background-color: transparent;
  margin: 10px 0;
}

#header-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: min(2vw, 15px);
}

button a {
  color: inherit;
}

.auth-button {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.theme-toggle {
  padding: 0.5rem;
  display: grid;
  place-items: center;
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
  color: var(--on-primary-color);
}

@media screen and (max-width: 750px) {
  .title h1 {
    display: none;
  }
}
</style>
