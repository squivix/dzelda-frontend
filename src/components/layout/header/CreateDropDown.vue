<template>
  <BaseDropDown v-if="userLanguages && userLanguages.length > 0" :is-pointy="true" id="add-menu">
    <template v-slot:button>
            <span class="add-button icon-wrapper">
              <inline-svg :src="icons.plus"/>
            </span>
    </template>
    <template v-slot:menu>
      <ol class="add-menu dropdown-list">
        <li>
          <router-link :to="{name:'add-lesson'}"><span>Add Lesson</span></router-link>
        </li>
        <li>
          <router-link :to="{name:'add-course'}"><span>Add Course</span></router-link>
        </li>
      </ol>
    </template>
  </BaseDropDown>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import LanguageDropDown from "@/components/layout/header/LanguageDropDown.vue";
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default defineComponent({
  name: "CreateDropDown",
  components: {InlineSvg, BaseDropDown, LanguageDropDown},
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

.add-menu {
  width: 100px;
}
</style>
