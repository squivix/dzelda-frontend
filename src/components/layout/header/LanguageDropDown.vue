<template>
  <BaseDropDown v-if="currentLanguage" class="language-dropdown" id="language">
    <template v-slot:button="{isDroppedDown}">
      <img :src="currentLanguage.flagCircular??''" alt="Current Language Icon"
           class="current-language-icon">
      <span class="icon-wrapper language-menu-arrow">
            <inline-svg :src="isDroppedDown?icons.arrowUp:icons.arrowDown"/>
          </span>
    </template>
    <template v-slot:menu>
      <ol class="language-grid dropdown-list" :style="{'grid-template-columns':`repeat(${gridColumns}, 1fr)`}">
        <li v-for="language in otherLanguages">
          <router-link :to="{params:{learningLanguage:language.code}}">
            <img class="image-icon language-icon" :src="language.flagCircular!"
                 :alt="`${language.code} language flag`">
            <span>{{ language.name }}</span>
          </router-link>
        </li>
        <li class="language-add-button">
          <router-link :to="{ name: 'new-language' }">
            <inline-svg :src="icons.plusRound"/>
          </router-link>
        </li>
      </ol>
    </template>
  </BaseDropDown>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default defineComponent({
  name: "LanguageDropDown",
  components: {InlineSvg, BaseDropDown},
  computed: {
    userLanguages() {
      return this.languageStore.userLanguages;
    },
    currentLanguage() {
      return this.userLanguages ? this.userLanguages[0] : null;
    },
    otherLanguages() {
      return this.userLanguages ? this.userLanguages!.filter(lang => lang.code !== this.currentLanguage!.code) : [];
    },
    gridColumns() {
      return Math.min(3, Math.floor(this.otherLanguages.length / 3));
    }
  },
  watch: {
    "otherLanguages.length": function () {

    }
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

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  background-color: var(--background-color);
  border-radius: 3px;
}

:deep(.language-add-button) {
  grid-column: 1/-1;
}

.current-language-icon {
  width: 50px;
  height: 50px;
  background-color: var(--on-primary-color);
  border-radius: 50%;
  padding: 0.2rem;
}

.language-icon {
  width: 25px;
  height: 25px;
}

.language-menu-arrow {
  background-color: var(--on-primary-color);
  color: dimgray;
  padding: 0.25rem;
  border-start-end-radius: 5px;
  border-end-end-radius: 5px;
  margin-inline-start: -3px;
}
</style>
