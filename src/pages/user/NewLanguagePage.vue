<template>
  <BaseCard title="New Language" class="new-language-card">
    <template v-slot:content>
      <div class="content">
        <p class="instructions-paragraph">Select a new language to learn from our list of supported languages</p>
        <ul v-if="supportedLanguages" class="languages">
          <li v-for="language in supportedLanguages" :key="language.code" @click="onLanguageClicked(language)">
            <LanguageCard :language="language"/>
          </li>
        </ul>
      </div>

      <AlreadyLearningDialog
          @onClosed="isAlreadyLearningDialogShown=false"
          :is-shown="isAlreadyLearningDialogShown"
          :language="alreadyLearningLanguage?.name"/>

      <StartLearningDialog :isShown="isNewLanguageDialogShown" :language="newLanguage" @onCanceled="isNewLanguageDialogShown=false" @onSubmitted="onNewLanguageSubmitted">

      </StartLearningDialog>
      <!--      <ConfirmDialog @onYesClicked="addNewLanguage"-->
      <!--                     @onNoClicked="isNewLanguageDialogShown=false"-->
      <!--                     @onClosed="isNewLanguageDialogShown=false"-->
      <!--                     :isShown="isNewLanguageDialogShown">-->
      <!--        <div v-if="newLanguage">-->
      <!--          <p>Start learning {{ newLanguage.name }}?</p>-->
      <!--        </div>-->
      <!--      </ConfirmDialog>-->

    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LanguageSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import LanguageCard from "@/components/page/new-language/LanguageCard.vue";
import AlreadyLearningDialog from "@/components/page/new-language/AlreadyLearningDialog.vue";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import StartLearningDialog from "@/components/page/new-language/StartLearningDialog.vue";

export default {
  name: "NewLanguagePage",
  components: {StartLearningDialog, ConfirmDialog, AlreadyLearningDialog, LanguageCard, InlineSvg, BaseCard},
  data() {
    return {
      supportedLanguages: null as (LanguageSchema & {
        isLearning: boolean
      })[] | null,
      isAlreadyLearningDialogShown: false,
      alreadyLearningLanguage: null as (LanguageSchema & {
        isLearning: boolean
      }) | null,
      isNewLanguageDialogShown: false,
      newLanguage: null as (LanguageSchema & {
        isLearning: boolean
      }) | null,
    };
  },
  methods: {
    async fetchSupportedLanguages() {
      return await this.languageStore.fetchLanguages({sortBy: "secondSpeakersCount", sortOrder: "desc", isSupported: true});
    },
    async onLanguageClicked(language: LanguageSchema & {
      isLearning: boolean
    }) {
      if (language.isLearning) {
        this.alreadyLearningLanguage = language;
        this.isAlreadyLearningDialogShown = true;
      } else {
        this.newLanguage = language;
        this.isNewLanguageDialogShown = true;
      }
    },
    async onNewLanguageSubmitted() {
      this.isNewLanguageDialogShown = false;
      await this.$router.push({name: "explore", params: {learningLanguage: this.newLanguage.code}});
    },
    async addNewLanguage() {
      if (this.newLanguage) {
        await this.languageStore.addLanguageToUser({languageCode: this.newLanguage.code});
        await this.languageStore.fetchUserLanguages({ignoreCache: true});
        this.isNewLanguageDialogShown = false;
        await this.$router.push({name: "explore", params: {learningLanguage: this.newLanguage.code}});
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
.instructions-paragraph {
  font-size: 1.15rem;
  margin-bottom: 1rem;
}

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
</style>
