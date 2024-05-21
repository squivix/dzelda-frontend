<template>
  <div class="settings-tab">
    <h2>Languages</h2>
    <LoadingScreen v-if="!userLanguages"/>
    <EmptyScreen v-else-if="userLanguages.length==0" message="No languages learning">
      <template>
        <router-link :to="{name:'new-language'}" class="new-language-button empty-screen inv-link">
          <inline-svg :src="icons.plusRound" class="empty-icon"/>
          <p>Not learning any languages</p>
          <p>Add language</p>
        </router-link>
      </template>
    </EmptyScreen>
    <ol v-else class="languages">
      <li v-for="language in userLanguages">
        <router-link :to="{name:'language-settings', params:{settingsLanguage:language.code}}" class="language inv-link">
          <div>
            <img class="language-flag" :src="language.flagCircular!" :alt="`${language.name} flag`">
            <p>{{ language.name }}</p>
          </div>
          <div>
            <p class="learning-since">
              Learning Since {{ new Date(language.startedLearningOn).toLocaleDateString() }}
            </p>
            <inline-svg :src="icons.arrowRight"/>
          </div>
        </router-link>
      </li>
      <li>
        <router-link :to="{name:'new-language'}" class="new-language-link">
          <inline-svg :src="icons.plusRound" class="language-icon"/>
          <p>Start learning another language</p>
        </router-link>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LearnerLanguageSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import SeriousConfirmDialog from "@/components/shared/SeriousConfirmDialog.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export default {
  name: "LanguagesTab",
  components: {LoadingScreen, EmptyScreen, SubmitButton, SeriousConfirmDialog, InlineSvg},
  data() {
    return {
      userLanguages: null as LearnerLanguageSchema[] | null,
    };
  },
  async mounted() {
    this.userLanguages = await this.languageStore.fetchUserLanguages();
  },
  setup() {
    return {
      icons,
      messageBarStore: useMessageBarStore(),
      languageStore: useLanguageStore()
    };
  }
};
</script>

<style scoped>
.settings-tab {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
}

h2 {
  font-size: 1.75rem;
}

.languages {
  display: flex;
  flex-direction: column;
}

.language {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.5rem;
  border-radius: 3px;
}

.language:hover {
  background-color: var(--zebra-stripe-color);
}

.language > div {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}

.language-flag {
  width: 40px;
  height: 40px;
}

.languages li:last-child {
  align-self: flex-start;
}

.new-language-link {
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
}

.new-language-link {
  color: var(--on-background-color);
}

.new-language-link svg {
  width: 20px;
  height: 20px;
}

.learning-since {
  color: gray;
}

@media screen and (max-width: 750px) {
  h2 {
    display: none
  }
}
</style>
