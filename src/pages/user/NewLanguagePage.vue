<template>
  <BaseCard title="New Language" class="new-language-card">
    <template v-slot:content>
      <div class="content">
        <p>Select a new language to learn from our list of supported languages</p>
        <ul v-if="supportedLanguages" class="languages">
          <li v-for="language in supportedLanguages" :key="language.code" @click="onLanguageClicked(language)">
              <span v-if="language.isLearning" class="is-learning-check icon-wrapper">
                <inline-svg :src="icons.checkMark"/>
              </span>
            <img :src="language.flagCircular!" :alt="`${language.code} language flag`"
                 class="language-flag">
            <div class="title-learners">
              <h4>{{ language.name }}</h4>
              <p>{{ language.learnersCount }} learners</p>
            </div>
          </li>
        </ul>
      </div>

      <BaseDialog :is-open="isAlreadyLearningDialogShown" @onBackDropClick="isAlreadyLearningDialogShown=false">
        <div v-if="alreadyLearningLanguage" class="already-learning-dialog">
          <p>You are already learning {{ alreadyLearningLanguage.name }}</p>
          <button class="primary-filled-button square-button ok-button" @click="isAlreadyLearningDialogShown=false">OK
          </button>
        </div>
      </BaseDialog>

      <BaseDialog :is-open="isNewLanguageDialogShown" @onBackDropClick="isNewLanguageDialogShown=false">
        <div v-if="newLanguage" class="new-language-dialog">
          <p>Start learning {{ newLanguage.name }}?</p>
          <div class="buttons-div">
            <button class="primary-filled-button square-button no-button" @click="isNewLanguageDialogShown=false">No
            </button>
            <button class="primary-filled-button square-button yes-button" @click="addNewLanguage">Yes
            </button>
          </div>
        </div>
      </BaseDialog>

    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LanguageSchema} from "dzelda-types";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import BaseDialog from "@/components/ui/BaseDialog.vue";

export default {
  name: "NewLanguagePage",
  components: {BaseDialog, InlineSvg, BaseCard},
  data() {
    return {
      supportedLanguages: null as (LanguageSchema & { isLearning: boolean })[] | null,
      isAlreadyLearningDialogShown: false,
      alreadyLearningLanguage: null as (LanguageSchema & { isLearning: boolean }) | null,
      isNewLanguageDialogShown: false,
      newLanguage: null as (LanguageSchema & { isLearning: boolean }) | null,
    };
  },
  methods: {
    async fetchSupportedLanguages() {
      return await this.languageStore.fetchLanguages({isSupported: true});
    },
    async onLanguageClicked(language: LanguageSchema & { isLearning: boolean }) {
      //TODO move to custom dialog
      if (language.isLearning) {
        this.alreadyLearningLanguage = language;
        this.isAlreadyLearningDialogShown = true;
      } else {//(confirm(`Start learning ${language.name}?`)) {

        this.newLanguage = language;
        this.isNewLanguageDialogShown = true;
      }
    },
    async addNewLanguage() {
      if (this.newLanguage) {
        await this.languageStore.addLanguageToUser({languageCode: this.newLanguage.code});
        await this.languageStore.fetchUserLanguages({ignoreCache: true});
        await this.$router.push({name: "explore", params: {learningLanguage: this.newLanguage.code}});
        this.isNewLanguageDialogShown = false;
      }
    },
  },
  async mounted() {
    const supportedLanguages = await this.fetchSupportedLanguages();
    const userLanguages = await this.languageStore.fetchUserLanguages();

    this.supportedLanguages = supportedLanguages.map((lang) => ({
      ...lang,
      isLearning: userLanguages.findIndex(l => l.code === lang.code) !== -1
    }));
  },
  setup() {
    return {icons, languageStore: useLanguageStore()};
  }
};
</script>

<style scoped>
.new-language-card {
  width: 85vw;
  max-width: 900px;
}

.content {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.languages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  row-gap: 1rem;
  column-gap: 1rem;
  flex-grow: 1;
}

.languages li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1rem;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: 1px solid lightgray;
  border-radius: 10px;
  transition: transform 0.15s ease-out;
  overflow: hidden;
  box-sizing: border-box;
}

.languages li:hover {
  transform: scale(1.04);
  cursor: pointer;
}

.languages li .title-learners {
  line-height: 1.25rem;
  text-align: center;
}

.languages li h4 {
  font-size: 1.2rem;
}

.languages li p {
  font-size: 0.9rem;
  color: darkslategray;
}

.language-flag {
  width: 125px;
  height: 125px;
}

.learning-language {
  background-color: red;
}

.is-learning-check {
  background-color: var(--secondary-color);
  color: var(--on-secondary-color);
  padding: 0.25rem;
  overflow: visible;
  border-radius: 3px;
  align-self: flex-end;
}

.is-learning-check svg {
  fill: var(--on-secondary-color);
}

.already-learning-dialog {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.ok-button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
}

.new-language-dialog {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.buttons-div {
  align-self: flex-end;
  display: flex;
  column-gap: 0.5rem;
}

.buttons-div button {

  padding: 0.5rem 1rem;
}

.yes-button {
}

.no-button {
  background-color: #FF3333;
  border-color: #FF3333;
}
</style>
