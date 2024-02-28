<template>
  <h5>Saved Meanings</h5>
  <ol class="user-meanings" v-if="savedMeanings.length>0">
    <li v-for="(meaning,meaningIndex) in savedMeanings" :key="meaning.id">
      <form @submit.prevent="submitEditMeaning(meaning,updatedMeaningTexts[meaningIndex],updatedMeaningLangs[meaningIndex])">
        <SubmitButton :keepText="false"
                      class="delete-user-meaning-button"
                      @click="submitDeleteMeaning(meaning)" type="button">
          <inline-svg :src="icons.cross"/>
        </SubmitButton>
        <select v-model="updatedMeaningLangs[meaningIndex]" v-if="preferredTranslationLanguages.length>1">
          <option v-for="translationLanguage in preferredTranslationLanguages" :value="translationLanguage.code">{{ translationLanguage.name }}</option>
        </select>
        <input v-model="updatedMeaningTexts[meaningIndex]" maxlength="500"/>
        <SubmitButton :isSubmitting="isSubmittingEditMeaningSet.has(meaning.id)" :keepText="false"
                      class="edit-user-meaning-button"
                      type="submit">
          <inline-svg :src="icons.checkMark"/>
        </SubmitButton>
      </form>
    </li>
  </ol>
  <p class="empty-message" v-else>None</p>
</template>

<script lang="ts">
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {PropType} from "vue";
import {MeaningSchema} from "dzelda-common";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default {
  name: "MeaningEditingControls",
  components: {InlineSvg, SubmitButton},
  emits: ["onMeaningEditSubmitted", "onMeaningDeleteClicked"],
  props: {
    vocabId: {type: Number, required: true},
    savedMeanings: {type: Array as PropType<MeaningSchema[]>, required: true},
    isSubmittingEditMeaningSet: {type: Object as PropType<Set<number>>, required: true}
  },
  data() {
    return {
      updatedMeaningTexts: [] as string[],
      updatedMeaningLangs: [] as string[],
    };
  },
  computed: {
    preferredTranslationLanguages() {
      return this.languageStore.currentLanguage!.preferredTranslationLanguages;
    },
  },
  watch: {
    savedMeanings() {
      this.updatedMeaningTexts = this.savedMeanings.map(m => m.text);
      this.updatedMeaningLangs = this.savedMeanings.map(m => m.language);
    }
  },
  methods: {
    submitEditMeaning(meaning: MeaningSchema, updatedMeaningText: string, updatedMeaningLang: string) {
      if (updatedMeaningText == "")
        this.submitDeleteMeaning(meaning);
      if (updatedMeaningText === meaning.text && updatedMeaningLang == meaning.language)
        return;
      this.$emit("onMeaningEditSubmitted", meaning, updatedMeaningText, updatedMeaningLang);
    },
    submitDeleteMeaning(meaning: MeaningSchema) {
      this.$emit("onMeaningDeleteClicked", meaning);
    },
  },
  mounted() {
    this.updatedMeaningTexts = this.savedMeanings.map(m => m.text);
    this.updatedMeaningLangs = this.savedMeanings.map(m => m.language);
  },
  setup() {
    return {
      icons,
      languageStore: useLanguageStore()
    };
  }
};
</script>

<style scoped>

.user-meanings {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.user-meanings > li > form {
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  justify-content: stretch;
  align-items: center;
}

.user-meanings input {
  width: 100%;
  flex-grow: 1;
}

.delete-user-meaning-button {
  min-width: 25px;
  height: 25px;
  padding: 0;
  background-color: var(--background-color);
  color: black;
  border: 1px solid grey;
  border-radius: 50%;
}

.delete-user-meaning-button svg {
  color: dimgrey;
  width: 10px;
  height: 10px;
}

.delete-user-meaning-button:hover {
  cursor: pointer;
}

.edit-user-meaning-button {
  min-width: 30px;
  height: 30px;
  padding: 0;
  background-color: #FFD263;
  color: black;
  border: 1px solid #FFD263;
  border-radius: 50%;
}

.edit-user-meaning-button svg {
  width: 10px;
  height: 10px;
}

.edit-user-meaning-button:hover {
  cursor: pointer;
}

.empty-message {
  font-size: 0.8rem;
}
</style>
