<template>
  <section>
    <h2 id="try-it-header">Try it yourself</h2>
    <LoadingScreen v-if="!isReady"/>
    <div class="try-it-content" v-else>
      <LessonReader class="lesson-reader"
                    :lessonId="selectedLessonId!"
                    :languageCode="selectedLanguage!.code"
                    :showDoneButton="false">
        <template v-slot:side-panel>
          <div class="side-panel-place-holder">
            <p>Select a word or phrase that you don't understand</p>
          </div>
        </template>
      </LessonReader>
      <div class="bottom-div">
        <div class="form-row">
          <label>Language</label>
          <select v-model="selectedLanguageIndex">
            <option v-for="(language, index) in languages" :value="index">{{ language.name }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>Text</label>
          <select v-model="selectedPreviewIndex">
            <option v-for="(preview ,index) in previews" :value="index">{{ preview.title }}</option>
          </select>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent, provide} from "vue";
import LessonReader from "@/components/shared/LessonReader.vue";
import {useLessonStoreMock} from "@/stores/backend/local-preview/lessonStoreMock.js";
import {useVocabStoreMock} from "@/stores/backend/local-preview/vocabStoreMock.js";
import {useMeaningStoreMock} from "@/stores/backend/local-preview/meaningStoreMock.js";
import {useDictionaryStoreMock} from "@/stores/backend/local-preview/dictionaryStoreMock.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LanguageSchema} from "dzelda-common";
import {PreviewLesson, useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";

export default defineComponent({
  name: "TryItSection",
  components: {LoadingScreen, LessonReader},
  data() {
    return {
      languages: null as LanguageSchema[] | null,
      selectedLanguageIndex: 0,
      selectedPreviewIndex: 0,
      previews: null as PreviewLesson[] | null,
      isLoading: true,
    };
  },
  computed: {
    selectedLessonId() {
      if (!this.selectedPreview || !this.selectedLanguage)
        return;
      return this.selectedPreview.languageVersions[this.selectedLanguage.code];
    },
    selectedLanguage() {
      return this.languages?.[this.selectedLanguageIndex];
    },
    selectedPreview() {
      return this.previews?.[this.selectedPreviewIndex];
    },
    isReady() {
      return !this.isLoading && this.languages !== null;
    },
  },
  async mounted() {
    this.isLoading = true;
    // TODO after localizing always filter out the current site language
    this.languages = (await this.languageStore.fetchLanguages({sortBy: "secondSpeakersCount", sortOrder: "desc"})).filter(l => l.code != "en");
    const db = await this.localPreviewStore.getPreviewDb();
    this.previews = await db.getAll("previews");
    this.isLoading = false;
  },
  setup() {
    provide("lessonStore", useLessonStoreMock());
    provide("vocabStore", useVocabStoreMock());
    provide("meaningStore", useMeaningStoreMock());
    provide("dictionaryStore", useDictionaryStoreMock());
    return {
      languageStore: useLanguageStore(),
      localPreviewStore: useLocalPreviewStore()
    };
  }
});
</script>

<style scoped>
section {
  margin-bottom: 20vh;
}

.try-it-content {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

h2 {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  padding-top: 3vh;
}

.lesson-reader {
  margin: 0;
}

.lesson-reader:deep(.top-div) {
  grid-template-rows: 70vh
}

.bottom-div {
  display: flex;
  column-gap: 1rem;
  align-items: center;
  width: 50%;
}

.bottom-div > .form-row {
  flex-grow: 1;
}


.form-row {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

select {
  height: 2rem;
  font-size: 1.05rem;
}

label {
  font-size: 1.5rem;
}

.side-panel-place-holder p {
  font-size: 1.25rem;
}

@media screen and (max-width: 750px) {
  .try-it-content {
    flex-direction: column-reverse;
  }
}
</style>
