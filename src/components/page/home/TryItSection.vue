<template>
  <section>
    <h2 id="try-it-header">Try it yourself</h2>
    <LoadingScreen v-if="!isReady"/>
    <div class="try-it-content" v-else>
      <LessonReader class="lesson-reader"
                    :lessonId="selectedLessonId!"
                    :languageCode="selectedLanguageCode!"
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
          <select v-model="selectedLanguageCode">
            <option v-for="language in languagesWithLessons" :value="language.code">{{ language.name }}</option>
          </select>
        </div>
        <div class="form-row">
          <label>Text</label>
          <select v-model="selectedLessonId">
            <option v-for="lesson in selectedLanguageLessons" :value="lesson.id">{{ lesson.title }}</option>
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
import {LanguageSchema, LessonSchema} from "dzelda-common";
import {useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";

export default defineComponent({
  name: "TryItSection",
  components: {LoadingScreen, LessonReader},
  data() {
    return {
      languages: null as LanguageSchema[] | null,
      selectedLanguageCode: null as string | null,
      languageLessonsMap: {} as Record<string, LessonSchema[]>,
      selectedLessonId: null as number | null,
      isLoading: true,
    };
  },
  computed: {
    selectedLanguageLessons() {
      if (!this.selectedLanguageCode)
        return;
      return this.languageLessonsMap[this.selectedLanguageCode];
    },
    languagesWithLessons() {
      if (!this.languages)
        return;
      return this.languages.filter(l => l.code in this.languageLessonsMap);
    },
    isReady() {
      return !this.isLoading && this.languages !== null && this.selectedLanguageCode !== null && this.selectedLessonId != null;
    }
  },
  watch: {
    languagesWithLessons() {
      if (!this.languagesWithLessons || this.languagesWithLessons.length == 0)
        return;
      this.selectedLanguageCode = this.languagesWithLessons[0].code;
    },
    selectedLanguageLessons() {
      if (!this.selectedLanguageLessons || this.selectedLanguageLessons.length == 0)
        return;
      this.selectedLessonId = this.selectedLanguageLessons[0].id;
    }
  },
  async mounted() {
    this.isLoading = true;
    this.languages = await this.languageStore.fetchLanguages();
    const db = await this.localPreviewStore.getPreviewDb();
    for (const language of this.languages) {
      const languageLessons = await db.getAllFromIndex("lessons", "languageIndex", language.code);
      if (languageLessons.length > 0)
        this.languageLessonsMap[language.code] = languageLessons;
    }
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
  margin-top: 5vh;
}

.try-it-content {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

h2 {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
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
