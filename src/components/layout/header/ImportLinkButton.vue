<template>
  <router-link :to="{name:'import'}">
    <span v-if="userLanguages && userLanguages.length > 0" class="add-button icon-wrapper">
      <inline-svg :src="icons.plus"/>
    </span>
  </router-link>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import LanguageDropDown from "@/components/layout/header/LanguageDropDown.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default defineComponent({
  name: "ImportLinkButton",
  components: {InlineSvg, LanguageDropDown},
  computed: {
    userLanguages() {
      return this.languageStore.userLanguages;
    },
    currentLanguage() {
      return this.userLanguages ? this.userLanguages[0] : null;
    },
  },
  setup() {
    return {
      icons,
      languageStore: useLanguageStore(),
    };
  }
});
</script>

<style scoped>

.add-button {
  background-color: var(--secondary-color);
  border: 1px solid var(--on-secondary-color);
  padding: 8px;
  border-radius: 8px;
}

.add-button svg {
  color: var(--on-secondary-color);
}
</style>
