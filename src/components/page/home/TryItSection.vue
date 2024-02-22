<template>
  <section>
    <h2 id="try-it-header">Try it yourself</h2>
    <LoadingScreen v-if="isLoading"/>
    <div class="try-it-content" v-else>
      <Reader class="text-reader"
                    :textId="selectedTextId!"
                    :languageCode="selectedLanguage!.code"
                    :showDoneButton="false">
        <template v-slot:side-panel>
          <div class="side-panel-place-holder">
            <p>Select a word or phrase that you don't understand</p>
          </div>
        </template>
      </Reader>
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
import Reader from "@/components/shared/Reader.vue";
import {useTextStoreMock} from "@/stores/backend/local-preview/textStoreMock.js";
import {useVocabStoreMock} from "@/stores/backend/local-preview/vocabStoreMock.js";
import {useMeaningStoreMock} from "@/stores/backend/local-preview/meaningStoreMock.js";
import {useDictionaryStoreMock} from "@/stores/backend/local-preview/dictionaryStoreMock.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {LanguageSchema} from "dzelda-common";
import {PreviewText, useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";

export default defineComponent({
  name: "TryItSection",
  components: {LoadingScreen, Reader},
  data() {
    return {
      languages: null as LanguageSchema[] | null,
      selectedLanguageIndex: 0,
      selectedPreviewIndex: 0,
      previews: null as PreviewText[] | null,
      isLoading: true,
    };
  },
  computed: {
    selectedTextId() {
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
  },
  async mounted() {
    this.isLoading = true;
    // TODO after localizing always filter out the current site language

    const db = await this.localPreviewStore.getPreviewDb();
    this.languages = (await db.getAll("languages")).filter(l => l.code !== "en");
    this.previews = await db.getAll("previews");
    this.isLoading = false;
  },
  setup() {
    provide("textStore", useTextStoreMock());
    provide("vocabStore", useVocabStoreMock());
    provide("meaningStore", useMeaningStoreMock());
    provide("dictionaryStore", useDictionaryStoreMock());
    provide("allowEditDictionaries", false);
    return {
      localPreviewStore: useLocalPreviewStore()
    };
  }
});
</script>

<style scoped>
section {
  margin-bottom: 25vh;
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

.text-reader {
  margin: 0;
}

.text-reader:deep(.top-div) {
  grid-template-rows: 70vh
}

.bottom-div {
  display: flex;
  column-gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  row-gap: 1rem;
}



select {
  height: 2.5rem;
  font-size: 1.05rem;
}

label {
  font-size: 1.5rem;
}

.side-panel-place-holder p {
  margin-top: 30px;
  font-size: 1.25rem;
}

@media screen and (max-width: 750px) {
  .try-it-content {
    flex-direction: column-reverse;
  }
}
</style>
